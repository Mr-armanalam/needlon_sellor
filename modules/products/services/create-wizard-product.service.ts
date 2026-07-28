import { db } from "@/db";
import { categoriesTable as categories } from "@/db/schema/catalog/categories/table";
import { inventoryTable } from "@/db/schema/catalog/products/inventory/table";
import { productImagesTable } from "@/db/schema/catalog/products/product-images/table";
import { generateUniqueSlug } from "@/modules/shared/slug/generate-unique-slug";
import { createProduct } from "../repository/commands/create-product";
import { createProductVariant } from "../repository/commands/create-product-variant";
import { existsProductSlug } from "../repository/queries/exists-product-slug";
import { getProductVariantBySku } from "../repository/queries/get-product-variant";
import { ProductWizardInput } from "../validations/product-wizard-schema";
import { sql } from "drizzle-orm";

export interface CreateWizardProductParams {
  sellerId: string;
  data: ProductWizardInput;
}

export async function createWizardProductService({ sellerId, data }: CreateWizardProductParams) {
  if (!sellerId) {
    throw new Error("Seller ID is required.");
  }

  // 1. Resolve or find Category ID safely
  let categoryId: string | null = null;
  const [existingCat] = await db
    .select({ id: categories.id })
    .from(categories)
    .limit(1);

  if (existingCat) {
    categoryId = existingCat.id;
  } else {
    const catSlug = await generateUniqueSlug(data.category, async () => false);
    const catRows = await db.execute(
      sql`INSERT INTO categories (name, slug, level) VALUES (${data.category}, ${catSlug}, 0) RETURNING id`
    );
    categoryId = (catRows[0] as any)?.id;
  }

  if (!categoryId) {
    throw new Error("Failed to assign a valid categories for the product.");
  }

  // 2. Enforce SKU uniqueness
  const existingSku = await getProductVariantBySku(data.uniqueSku.trim());
  if (existingSku) {
    throw new Error(`Variant with SKU "${data.uniqueSku}" already exists.`);
  }

  // 3. Generate unique product slug
  const slug = await generateUniqueSlug(data.name, (candidate) => existsProductSlug(candidate));

  // 4. Insert master product record
  const product = await createProduct({
    storeId: sellerId,
    categoryId,
    name: data.name.trim(),
    slug,
    shortDescription: data.brandLabel ? `Brand: ${data.brandLabel}` : undefined,
    description: data.descriptionStory,
    productType: "PHYSICAL",
    status: data.status ?? "DRAFT",
    visibility: data.customVisibility ?? "PUBLIC",
    isFeatured: false,
    publishedAt: data.status === "PUBLISHED" ? new Date() : null,
  });

  // 5. Create default product variant
  const variant = await createProductVariant({
    productId: product.id,
    sku: data.uniqueSku.trim(),
    price: data.retailPrice,
    compareAtPrice: data.discountOfferRate ? data.retailPrice : undefined,
    weightGrams: data.packageWeight ? Math.round(parseFloat(data.packageWeight) * 1000) || 350 : 350,
    status: "ACTIVE",
    position: 0,
  });

  // 6. Insert inventory record
  const [invRecord] = await db
    .insert(inventoryTable)
    .values({
      variantId: variant.id,
      quantity: data.boutiqueStockCount,
      lowStockThreshold: 5,
    })
    .returning();

  // 7. Insert media assets if provided
  const mediaRecords = [];
  if (data.mediaUrls && data.mediaUrls.length > 0) {
    for (let i = 0; i < data.mediaUrls.length; i++) {
      const url = data.mediaUrls[i];
      const [media] = await db
        .insert(productImagesTable)
        .values({
          productId: product.id,
          imageUrl: url,
          storageKey: `image-${i}.jpg`,
          displayOrder: i,
          isPrimary: i === 0,
        })
        .returning();
      mediaRecords.push(media);
    }
  }

  return {
    ...product,
    variant,
    inventory: invRecord,
    media: mediaRecords,
  };
}

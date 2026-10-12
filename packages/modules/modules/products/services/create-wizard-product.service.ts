import { db } from "@/db";
import { categoriesTable as categories } from "@/db/schema/catalog/categories/table";
import { inventoryTable } from "@/db/schema/catalog/products/inventory/table";
import { pricingTable } from "@/db/schema/catalog/products/pricing/table";
import { productImagesTable } from "@/db/schema/catalog/products/product-images/table";
import { generateUniqueSlug } from "@/modules/shared/slug/generate-unique-slug";
import { createProduct, createProductVariant, existsProductSlug, getProductVariantBySku } from "../repository";
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
    weightGrams: data.packageWeight ? Math.round(parseFloat(data.packageWeight) * 1000) || 350 : 350,
    status: "ACTIVE",
    position: 0,
  });

  // 5b. Insert pricing record
  if (data.retailPrice) {
    await db.insert(pricingTable).values({
      variantId: variant.id,
      currencyCode: "INR",
      price: data.retailPrice,
      discountRate: data.discountOfferRate || "0.00",
      compareAtPrice: data.discountOfferRate ? data.retailPrice : undefined,
    });
  }

  // 5c. Persist variant attributes if provided
  if (data.sizesMatrix || data.colorsTrack || data.fabricMaterial) {
    const { updateDraftProductVariants } = await import("../repository/draft-product.repository");
    await updateDraftProductVariants(
      product.id,
      categoryId,
      data.sizesMatrix,
      data.colorsTrack,
      { fabricMaterial: data.fabricMaterial },
      sellerId
    );
  }

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
    const { uploadProductMediaDataUrlToSupabase } = await import("./upload-product-media.service");
    for (let i = 0; i < data.mediaUrls.length; i++) {
      let url = data.mediaUrls[i];
      let storageKey = `image-${i}.jpg`;
      let mediaType = "IMAGE";

      if (url.startsWith("data:")) {
        try {
          const uploadRes = await uploadProductMediaDataUrlToSupabase(product.id, url);
          url = uploadRes.publicUrl;
          storageKey = uploadRes.storageKey;
          mediaType = uploadRes.mediaType;
        } catch (uErr) {
          console.warn("Failed uploading wizard media dataUrl to Supabase:", uErr);
        }
      }

      const [media] = await db
        .insert(productImagesTable)
        .values({
          productId: product.id,
          imageUrl: url,
          storageKey,
          mediaType,
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

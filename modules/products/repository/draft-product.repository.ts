import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { productVariantsTable } from "@/db/schema/catalog/products/product-variants/table";
import { pricingTable } from "@/db/schema/catalog/products/pricing/table";
import { productVariantOptionsTable } from "@/db/schema/catalog/products/product-variant-options/table";
import { categoryAttributes } from "@/db/schema/catalog/categories/category_attributes";
import { categoryAttributeOptions } from "@/db/schema/catalog/categories/category_attribute_options";
import { inventoryTable } from "@/db/schema/catalog/products/inventory/table";
import { shippingTable } from "@/db/schema/catalog/products/shipping/table";
import { productSeoTable } from "@/db/schema/catalog/products/product-seo/table";

export async function updateDraftProductPricing(
  productId: string,
  retailPrice: string | number,
  discountOfferRate?: string | number
) {
  const [variant] = await db
    .select()
    .from(productVariantsTable)
    .where(eq(productVariantsTable.productId, productId))
    .limit(1);

  if (variant) {
    const price = retailPrice ? String(retailPrice) : "0.00";
    const comparePrice = discountOfferRate
      ? String(Number(price) * (1 + Number(discountOfferRate) / 100))
      : null;

    await db
      .update(productVariantsTable)
      .set({ price, compareAtPrice: comparePrice })
      .where(eq(productVariantsTable.id, variant.id));

    await db
      .update(pricingTable)
      .set({ price, compareAtPrice: comparePrice })
      .where(eq(pricingTable.variantId, variant.id));
  }
}

export async function updateDraftProductVariants(
  productId: string,
  categoryId: string,
  sizesMatrix?: string,
  colorsTrack?: string
) {
  const [variant] = await db
    .select()
    .from(productVariantsTable)
    .where(eq(productVariantsTable.productId, productId))
    .limit(1);

  if (variant) {
    if (sizesMatrix) {
      const [sizeAttr] = await db
        .select()
        .from(categoryAttributes)
        .where(and(
          eq(categoryAttributes.categoryId, categoryId),
          eq(categoryAttributes.name, "Size")
        ))
        .limit(1);

      if (sizeAttr) {
        const firstSize = sizesMatrix.split(",")[0].trim().toLowerCase();
        const [opt] = await db
          .select()
          .from(categoryAttributeOptions)
          .where(and(
            eq(categoryAttributeOptions.attributeId, sizeAttr.id),
            eq(categoryAttributeOptions.value, firstSize)
          ))
          .limit(1);

        if (opt) {
          await db
            .insert(productVariantOptionsTable)
            .values({
              variantId: variant.id,
              attributeId: sizeAttr.id,
              attributeOptionId: opt.id,
            })
            .onConflictDoNothing();
        }
      }
    }

    if (colorsTrack) {
      const [colorAttr] = await db
        .select()
        .from(categoryAttributes)
        .where(and(
          eq(categoryAttributes.categoryId, categoryId),
          eq(categoryAttributes.name, "Color")
        ))
        .limit(1);

      if (colorAttr) {
        const firstColor = colorsTrack.split(",")[0].trim().toLowerCase().replace(" ", "_");
        const [opt] = await db
          .select()
          .from(categoryAttributeOptions)
          .where(and(
            eq(categoryAttributeOptions.attributeId, colorAttr.id),
            eq(categoryAttributeOptions.value, firstColor)
          ))
          .limit(1);

        if (opt) {
          await db
            .insert(productVariantOptionsTable)
            .values({
              variantId: variant.id,
              attributeId: colorAttr.id,
              attributeOptionId: opt.id,
            })
            .onConflictDoNothing();
        }
      }
    }
  }
}

export async function updateDraftProductInventory(
  productId: string,
  uniqueSku?: string,
  boutiqueStockCount?: string | number
) {
  const [variant] = await db
    .select()
    .from(productVariantsTable)
    .where(eq(productVariantsTable.productId, productId))
    .limit(1);

  if (variant) {
    if (uniqueSku) {
      await db
        .update(productVariantsTable)
        .set({ sku: uniqueSku.trim() })
        .where(eq(productVariantsTable.id, variant.id));
    }

    if (boutiqueStockCount !== undefined) {
      await db
        .update(inventoryTable)
        .set({ quantity: Number(boutiqueStockCount) })
        .where(eq(inventoryTable.variantId, variant.id));
    }
  }
}

export async function updateDraftProductDelivery(
  productId: string,
  packageWeight?: string | number
) {
  const [variant] = await db
    .select()
    .from(productVariantsTable)
    .where(eq(productVariantsTable.productId, productId))
    .limit(1);

  if (variant) {
    const weightVal = packageWeight ? String(packageWeight) : "0.00";
    const weightG = Math.round(parseFloat(weightVal) * 1000) || 0;

    await db
      .update(productVariantsTable)
      .set({ weightGrams: weightG })
      .where(eq(productVariantsTable.id, variant.id));

    await db
      .update(shippingTable)
      .set({ weight: weightVal })
      .where(eq(shippingTable.variantId, variant.id));
  }
}

export async function updateDraftProductSeo(
  productId: string,
  searchKeywords?: string
) {
  const keywords = searchKeywords
    ? searchKeywords.split(",").map((k: string) => k.trim())
    : [];

  await db
    .update(productSeoTable)
    .set({ metaKeywords: keywords })
    .where(eq(productSeoTable.productId, productId));
}

import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { productsTable } from "@/db/schema/catalog/products/table";
import { productVariantsTable } from "@/db/schema/catalog/products/product-variants/table";
import { pricingTable } from "@/db/schema/catalog/products/pricing/table";
import { productVariantOptionsTable } from "@/db/schema/catalog/products/product-variant-options/table";
import { categoryAttributesTable as categoryAttributes } from "@/db/schema/catalog/category-attributes";
import { categoryAttributeOptionsTable as categoryAttributeOptions } from "@/db/schema/catalog/category-attribute-options";
import { inventoryTable } from "@/db/schema/catalog/products/inventory/table";
import { shippingTable } from "@/db/schema/catalog/products/shipping/table";
import { productSeoTable } from "@/db/schema/catalog/products/product-seo/table";
import { productImagesTable } from "@/db/schema/catalog/products/product-images/table";
import { productAttributeValuesTable } from "@/db/schema/catalog/products/product-attribute-values/table";
import { productTagsTable } from "@/db/schema/catalog/products/product-tags/table";
import { productTagMappingsTable } from "@/db/schema/catalog/products/product-tag-mappings/table";
import { categoriesTable } from "@/db/schema/catalog/categories/table";

export interface UpdateDraftBasicInfoParams {
  name?: string;
  brandLabel?: string;
  category?: string;
  subcategory?: string;
  descriptionStory?: string;
  slug?: string;
  isCustomizable?: boolean;
}

export async function updateDraftProductBasicInfo(
  productId: string,
  input: UpdateDraftBasicInfoParams
) {
  const updateData: any = { updatedAt: new Date() };
  if (input.name) updateData.name = input.name;
  if (input.descriptionStory !== undefined) updateData.description = input.descriptionStory;
  if (input.slug) updateData.slug = input.slug;
  if (input.isCustomizable !== undefined) updateData.isCustomizable = input.isCustomizable;

  if (input.category) {
    const [cat] = await db
      .select({ id: categoriesTable.id })
      .from(categoriesTable)
      .where(eq(categoriesTable.name, input.category))
      .limit(1);

    if (cat) {
      updateData.categoryId = cat.id;
    }
  }

  if (input.brandLabel || input.subcategory) {
    const parts: string[] = [];
    if (input.brandLabel) parts.push(`Brand: ${input.brandLabel}`);
    if (input.subcategory) parts.push(`Subcategory: ${input.subcategory}`);
    updateData.shortDescription = parts.join(" | ");
  }

  const [updated] = await db
    .update(productsTable)
    .set(updateData)
    .where(eq(productsTable.id, productId))
    .returning();

  // Also sync productSeoTable metaTitle & description
  if (input.name) {
    await db
      .update(productSeoTable)
      .set({
        metaTitle: `${input.name} | Needlon`,
        metaDescription: input.descriptionStory ? input.descriptionStory.slice(0, 160) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(productSeoTable.productId, productId));
  }

  return updated;
}

export async function updateDraftProductPricing(
  productId: string,
  retailPrice?: string | number,
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

    // Pricing table is the single authoritative source
    await db
      .update(pricingTable)
      .set({
        price,
        compareAtPrice: comparePrice,
        currencyCode: "INR",
        updatedAt: new Date(),
      })
      .where(eq(pricingTable.variantId, variant.id));

    // Synchronize product_variants for backward compatibility
    await db
      .update(productVariantsTable)
      .set({
        price,
        compareAtPrice: comparePrice,
        updatedAt: new Date(),
      })
      .where(eq(productVariantsTable.id, variant.id));
  }
}

export interface UpdateDraftVariantsParams {
  sizesMatrix?: string;
  colorsTrack?: string;
  fabricMaterial?: string;
  sleevesStyle?: string;
  fitType?: string;
  occasionFocus?: string;
  genderProfile?: string;
  targetAgeGroup?: string;
  [key: string]: unknown;
}

export async function updateDraftProductVariants(
  productId: string,
  categoryId: string,
  sizesMatrix?: string,
  colorsTrack?: string,
  extraParams?: Partial<UpdateDraftVariantsParams>
) {
  const [variant] = await db
    .select()
    .from(productVariantsTable)
    .where(eq(productVariantsTable.productId, productId))
    .limit(1);

  if (variant) {
    // 1. Update variant name
    const variantName = [sizesMatrix, colorsTrack].filter(Boolean).join(" - ") || "Standard Variant";
    await db
      .update(productVariantsTable)
      .set({
        name: variantName,
        updatedAt: new Date(),
      })
      .where(eq(productVariantsTable.id, variant.id));

    // 2. Link Size & Color in productVariantOptionsTable
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

    // 3. Upsert garment specs into productAttributeValuesTable
    const attributesToSave = [
      { key: "fabric", name: "Fabric Material", val: extraParams?.fabricMaterial },
      { key: "sleeves", name: "Sleeves Style", val: extraParams?.sleevesStyle },
      { key: "fit", name: "Fit Type", val: extraParams?.fitType },
      { key: "occasion", name: "Occasion Focus", val: extraParams?.occasionFocus },
      { key: "gender", name: "Gender Profile", val: extraParams?.genderProfile },
      { key: "age_group", name: "Target Age Group", val: extraParams?.targetAgeGroup },
    ];

    for (const item of attributesToSave) {
      if (item.val && typeof item.val === "string" && item.val.trim()) {
        let [attr] = await db
          .select()
          .from(categoryAttributes)
          .where(and(
            eq(categoryAttributes.categoryId, categoryId),
            eq(categoryAttributes.attributeKey, item.key)
          ))
          .limit(1);

        if (!attr) {
          [attr] = await db
            .select()
            .from(categoryAttributes)
            .where(and(
              eq(categoryAttributes.categoryId, categoryId),
              eq(categoryAttributes.name, item.name)
            ))
            .limit(1);
        }

        if (!attr) {
          const [newAttr] = await db
            .insert(categoryAttributes)
            .values({
              categoryId,
              attributeKey: item.key,
              name: item.name,
              slug: item.key,
              inputType: "TEXT",
              dataType: "STRING",
            })
            .returning();
          attr = newAttr;
        }

        if (attr) {
          await db
            .insert(productAttributeValuesTable)
            .values({
              productId,
              attributeId: attr.id,
              valueText: item.val.trim(),
            })
            .onConflictDoUpdate({
              target: [productAttributeValuesTable.productId, productAttributeValuesTable.attributeId],
              set: {
                valueText: item.val.trim(),
                updatedAt: new Date(),
              },
            });
        }
      }
    }
  }
}

export async function updateDraftProductInventory(
  productId: string,
  uniqueSku?: string,
  boutiqueStockCount?: string | number,
  extraParams?: {
    lowStockThreshold?: number | string;
    allowBackorder?: boolean;
    barcode?: string;
  }
) {
  const [variant] = await db
    .select()
    .from(productVariantsTable)
    .where(eq(productVariantsTable.productId, productId))
    .limit(1);

  if (variant) {
    const variantUpdate: Record<string, unknown> = { updatedAt: new Date() };
    if (uniqueSku !== undefined && uniqueSku.trim()) {
      variantUpdate.sku = uniqueSku.trim();
    }
    if (extraParams?.barcode !== undefined) {
      variantUpdate.barcode = extraParams.barcode?.trim() || null;
    }

    if (Object.keys(variantUpdate).length > 1) {
      await db
        .update(productVariantsTable)
        .set(variantUpdate)
        .where(eq(productVariantsTable.id, variant.id));
    }

    const invUpdate: Record<string, unknown> = { updatedAt: new Date() };
    if (boutiqueStockCount !== undefined && String(boutiqueStockCount).trim() !== "") {
      invUpdate.quantity = Number(boutiqueStockCount) || 0;
    }
    if (extraParams?.lowStockThreshold !== undefined && String(extraParams.lowStockThreshold).trim() !== "") {
      invUpdate.lowStockThreshold = Number(extraParams.lowStockThreshold) || 0;
    }
    if (extraParams?.allowBackorder !== undefined) {
      invUpdate.allowBackorder = Boolean(extraParams.allowBackorder);
    }

    if (Object.keys(invUpdate).length > 1) {
      await db
        .update(inventoryTable)
        .set(invUpdate)
        .where(eq(inventoryTable.variantId, variant.id));
    }
  }
}

export interface UpdateDraftDeliveryParams {
  packageWeight?: string | number;
  pickupHubAddress?: string;
  deliveryRadiusRange?: string;
  estimatedDeliveryWindow?: string;
}

export async function updateDraftProductDelivery(
  productId: string,
  packageWeight?: string | number,
  deliveryMeta?: {
    pickupHubAddress?: string;
    deliveryRadiusRange?: string;
    estimatedDeliveryWindow?: string;
  }
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
      .set({ weightGrams: weightG, updatedAt: new Date() })
      .where(eq(productVariantsTable.id, variant.id));

    const metadata: Record<string, unknown> = {};
    if (deliveryMeta?.pickupHubAddress) metadata.pickupHubAddress = deliveryMeta.pickupHubAddress;
    if (deliveryMeta?.deliveryRadiusRange) metadata.deliveryRadiusRange = deliveryMeta.deliveryRadiusRange;
    if (deliveryMeta?.estimatedDeliveryWindow) metadata.estimatedDeliveryWindow = deliveryMeta.estimatedDeliveryWindow;

    await db
      .update(shippingTable)
      .set({
        weight: weightVal,
        metadata,
        updatedAt: new Date(),
      })
      .where(eq(shippingTable.variantId, variant.id));
  }
}

export async function updateDraftProductSeo(
  productId: string,
  searchKeywords?: string,
  customVisibility?: "PUBLIC" | "PRIVATE" | "UNLISTED"
) {
  const keywords = searchKeywords
    ? searchKeywords.split(",").map((k: string) => k.trim()).filter(Boolean)
    : [];

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, productId))
    .limit(1);

  // Update visibility on master product
  if (customVisibility) {
    await db
      .update(productsTable)
      .set({ visibility: customVisibility, updatedAt: new Date() })
      .where(eq(productsTable.id, productId));
  }

  const [primaryImage] = await db
    .select()
    .from(productImagesTable)
    .where(and(eq(productImagesTable.productId, productId), eq(productImagesTable.isPrimary, true)))
    .limit(1);

  const [anyImage] = !primaryImage
    ? await db
        .select()
        .from(productImagesTable)
        .where(eq(productImagesTable.productId, productId))
        .limit(1)
    : [primaryImage];

  const metaTitle = product ? `${product.name} | Needlon` : "Needlon Product";
  const metaDescription = product?.description ? product.description.slice(0, 160) : "";
  const imageUrl = primaryImage?.imageUrl || anyImage?.imageUrl || null;

  // Upsert productSeoTable to ensure keywords are never silently lost
  const [existingSeo] = await db
    .select({ id: productSeoTable.id })
    .from(productSeoTable)
    .where(eq(productSeoTable.productId, productId))
    .limit(1);

  if (existingSeo) {
    await db
      .update(productSeoTable)
      .set({
        metaKeywords: keywords,
        metaTitle,
        metaDescription,
        ogTitle: metaTitle,
        ogDescription: metaDescription,
        ogImage: imageUrl,
        twitterTitle: metaTitle,
        twitterDescription: metaDescription,
        twitterImage: imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(productSeoTable.productId, productId));
  } else {
    await db
      .insert(productSeoTable)
      .values({
        productId,
        slug: product?.slug || `seo-${productId.slice(0, 8)}`,
        metaKeywords: keywords,
        metaTitle,
        metaDescription,
        ogTitle: metaTitle,
        ogDescription: metaDescription,
        ogImage: imageUrl,
        twitterTitle: metaTitle,
        twitterDescription: metaDescription,
        twitterImage: imageUrl,
      });
  }

  // Clear existing mappings before refreshing
  await db
    .delete(productTagMappingsTable)
    .where(eq(productTagMappingsTable.productId, productId));

  // Upsert keywords into product_tags and product_tag_mappings
  for (const kw of keywords) {
    if (!kw) continue;
    const tagSlug = kw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (!tagSlug) continue;

    let [tag] = await db
      .select()
      .from(productTagsTable)
      .where(eq(productTagsTable.slug, tagSlug))
      .limit(1);

    if (!tag) {
      const [newTag] = await db
        .insert(productTagsTable)
        .values({
          name: kw,
          slug: tagSlug,
        })
        .onConflictDoNothing()
        .returning();
      tag = newTag;
    }

    if (tag) {
      await db
        .insert(productTagMappingsTable)
        .values({
          productId,
          tagId: tag.id,
        })
        .onConflictDoNothing();
    }
  }
}

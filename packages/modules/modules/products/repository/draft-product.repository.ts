import { db } from "@/db";
import { eq, and, or, ilike } from "drizzle-orm";
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
import { generateProductSeoData } from "../lib/seo-generator";

export interface UpdateDraftBasicInfoParams {
  name?: string;
  brandLabel?: string;
  brandId?: string | null;
  brandName?: string | null;
  category?: string;
  categoryId?: string | null;
  subcategory?: string;
  subcategoryId?: string | null;
  descriptionStory?: string;
  slug?: string;
  isCustomizable?: boolean;
}

export async function updateDraftProductBasicInfo(
  productId: string,
  input: UpdateDraftBasicInfoParams,
  sellerId?: string
) {
  const updateData: any = { updatedAt: new Date() };
  if (input.name) updateData.name = input.name;
  if (input.descriptionStory !== undefined) updateData.description = input.descriptionStory;
  if (input.slug) updateData.slug = input.slug;
  if (input.isCustomizable !== undefined) updateData.isCustomizable = input.isCustomizable;

  if (input.categoryId) {
    updateData.categoryId = input.categoryId;
  } else if (input.category) {
    const [cat] = await db
      .select({ id: categoriesTable.id })
      .from(categoriesTable)
      .where(eq(categoriesTable.name, input.category))
      .limit(1);

    if (cat) {
      updateData.categoryId = cat.id;
    }
  }

  if (input.subcategoryId) {
    updateData.subcategoryId = input.subcategoryId;
  } else if (input.subcategory && updateData.categoryId) {
    const [subCat] = await db
      .select({ id: categoriesTable.id })
      .from(categoriesTable)
      .where(and(
        eq(categoriesTable.name, input.subcategory),
        eq(categoriesTable.parentId, updateData.categoryId)
      ))
      .limit(1);

    if (subCat) {
      updateData.subcategoryId = subCat.id;
    }
  }

  if (input.brandId !== undefined) {
    updateData.brandId = input.brandId;
  }
  if (input.brandName !== undefined || input.brandLabel !== undefined) {
    updateData.brandName = input.brandName || input.brandLabel;
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
        ...(sellerId ? { updatedBy: sellerId } : {}),
      })
      .where(eq(productSeoTable.productId, productId));
  }

  return updated;
}

export interface UpdateDraftPricingParams {
  retailPrice?: string | number;
  discountOfferRate?: string | number;
  currencyCode?: string;
  compareAtPrice?: string | number | null;
  costPrice?: string | number | null;
  minimumAdvertisedPrice?: string | number | null;
  effectiveFrom?: string | Date | null;
  effectiveUntil?: string | Date | null;
  isTaxInclusive?: boolean;
  metadata?: Record<string, unknown>;
  sellerId?: string | null;
}

export async function updateDraftProductPricing(
  productId: string,
  retailPrice?: string | number,
  discountOfferRate?: string | number,
  extraParams?: Partial<UpdateDraftPricingParams>,
  sellerId?: string
) {
  const [variant] = await db
    .select()
    .from(productVariantsTable)
    .where(eq(productVariantsTable.productId, productId))
    .limit(1);

  if (variant) {
    const effectiveSellerId = sellerId || extraParams?.sellerId || null;
    const price = retailPrice ? String(retailPrice) : "0.00";
    const discountRate = discountOfferRate !== undefined && discountOfferRate !== null && String(discountOfferRate).trim() !== ""
      ? String(discountOfferRate)
      : "0.00";

    let comparePrice: string | null = null;
    if (extraParams?.compareAtPrice !== undefined && extraParams?.compareAtPrice !== null && String(extraParams.compareAtPrice).trim() !== "") {
      comparePrice = String(extraParams.compareAtPrice);
    } else if (Number(discountRate) > 0 && Number(price) > 0) {
      const calculatedMrp = Number(price) / (1 - Number(discountRate) / 100);
      comparePrice = calculatedMrp.toFixed(2);
    }

    const pricingUpdate: any = {
      price,
      discountRate,
      compareAtPrice: comparePrice,
      currencyCode: extraParams?.currencyCode || "INR",
      isTaxInclusive: extraParams?.isTaxInclusive ?? true,
      updatedAt: new Date(),
    };

    if (extraParams?.costPrice !== undefined) {
      pricingUpdate.costPrice = extraParams.costPrice ? String(extraParams.costPrice) : null;
    }
    if (extraParams?.minimumAdvertisedPrice !== undefined) {
      pricingUpdate.minimumAdvertisedPrice = extraParams.minimumAdvertisedPrice ? String(extraParams.minimumAdvertisedPrice) : null;
    }
    if (extraParams?.effectiveFrom !== undefined) {
      pricingUpdate.effectiveFrom = extraParams.effectiveFrom ? new Date(extraParams.effectiveFrom) : null;
    }
    if (extraParams?.effectiveUntil !== undefined) {
      pricingUpdate.effectiveUntil = extraParams.effectiveUntil ? new Date(extraParams.effectiveUntil) : null;
    }
    if (extraParams?.metadata !== undefined) {
      pricingUpdate.metadata = extraParams.metadata;
    }
    if (effectiveSellerId) {
      pricingUpdate.updatedBy = effectiveSellerId;
    }

    const [existing] = await db
      .select({ id: pricingTable.id })
      .from(pricingTable)
      .where(eq(pricingTable.variantId, variant.id))
      .limit(1);

    if (existing) {
      await db
        .update(pricingTable)
        .set(pricingUpdate)
        .where(eq(pricingTable.variantId, variant.id));
    } else {
      await db
        .insert(pricingTable)
        .values({
          variantId: variant.id,
          ...pricingUpdate,
          createdBy: effectiveSellerId,
        });
    }
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
  extraParams?: Partial<UpdateDraftVariantsParams>,
  sellerId?: string
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
        ...(sellerId ? { updatedBy: sellerId } : {}),
      })
      .where(eq(productVariantsTable.id, variant.id));

    // 2. Link Size in productVariantOptionsTable
    if (sizesMatrix && categoryId) {
      let [sizeAttr] = await db
        .select()
        .from(categoryAttributes)
        .where(and(
          eq(categoryAttributes.categoryId, categoryId),
          eq(categoryAttributes.name, "Size")
        ))
        .limit(1);

      if (!sizeAttr) {
        const [attrByKey] = await db
          .select()
          .from(categoryAttributes)
          .where(and(
            eq(categoryAttributes.categoryId, categoryId),
            eq(categoryAttributes.attributeKey, "size")
          ))
          .limit(1);
        if (attrByKey) sizeAttr = attrByKey;
      }

      if (!sizeAttr) {
        const [newSizeAttr] = await db
          .insert(categoryAttributes)
          .values({
            categoryId,
            attributeKey: "size",
            name: "Size",
            slug: "size",
            inputType: "SELECT",
            dataType: "STRING",
            createdBy: sellerId,
            updatedBy: sellerId,
          })
          .returning();
        sizeAttr = newSizeAttr;
      }

      if (sizeAttr) {
        const firstSize = sizesMatrix.split(",")[0].trim();
        let [opt] = await db
          .select()
          .from(categoryAttributeOptions)
          .where(and(
            eq(categoryAttributeOptions.attributeId, sizeAttr.id),
            or(
              eq(categoryAttributeOptions.value, firstSize),
              eq(categoryAttributeOptions.label, firstSize),
              ilike(categoryAttributeOptions.value, firstSize),
              ilike(categoryAttributeOptions.label, firstSize)
            )
          ))
          .limit(1);

        if (!opt) {
          try {
            const [newOpt] = await db
              .insert(categoryAttributeOptions)
              .values({
                attributeId: sizeAttr.id,
                value: firstSize,
                label: firstSize,
                createdBy: sellerId,
                updatedBy: sellerId,
              })
              .returning();
            opt = newOpt;
          } catch {
            const [existingOpt] = await db
              .select()
              .from(categoryAttributeOptions)
              .where(and(
                eq(categoryAttributeOptions.attributeId, sizeAttr.id),
                or(
                  eq(categoryAttributeOptions.value, firstSize),
                  eq(categoryAttributeOptions.label, firstSize),
                  ilike(categoryAttributeOptions.value, firstSize),
                  ilike(categoryAttributeOptions.label, firstSize)
                )
              ))
              .limit(1);
            opt = existingOpt;
          }
        }

        if (opt) {
          await db
            .insert(productVariantOptionsTable)
            .values({
              variantId: variant.id,
              attributeId: sizeAttr.id,
              attributeOptionId: opt.id,
              createdBy: sellerId,
              updatedBy: sellerId,
            })
            .onConflictDoUpdate({
              target: [productVariantOptionsTable.variantId, productVariantOptionsTable.attributeId],
              set: {
                attributeOptionId: opt.id,
                updatedBy: sellerId,
                updatedAt: new Date(),
              },
            });
        }
      }
    }

    // 3. Link Color in productVariantOptionsTable
    if (colorsTrack && categoryId) {
      let [colorAttr] = await db
        .select()
        .from(categoryAttributes)
        .where(and(
          eq(categoryAttributes.categoryId, categoryId),
          eq(categoryAttributes.name, "Color")
        ))
        .limit(1);

      if (!colorAttr) {
        const [attrByKey] = await db
          .select()
          .from(categoryAttributes)
          .where(and(
            eq(categoryAttributes.categoryId, categoryId),
            eq(categoryAttributes.attributeKey, "color")
          ))
          .limit(1);
        if (attrByKey) colorAttr = attrByKey;
      }

      if (!colorAttr) {
        const [newColorAttr] = await db
          .insert(categoryAttributes)
          .values({
            categoryId,
            attributeKey: "color",
            name: "Color",
            slug: "color",
            inputType: "SELECT",
            dataType: "STRING",
            createdBy: sellerId,
            updatedBy: sellerId,
          })
          .returning();
        colorAttr = newColorAttr;
      }

      if (colorAttr) {
        const firstColor = colorsTrack.split(",")[0].trim();
        let [opt] = await db
          .select()
          .from(categoryAttributeOptions)
          .where(and(
            eq(categoryAttributeOptions.attributeId, colorAttr.id),
            or(
              eq(categoryAttributeOptions.value, firstColor),
              eq(categoryAttributeOptions.label, firstColor),
              ilike(categoryAttributeOptions.value, firstColor),
              ilike(categoryAttributeOptions.label, firstColor)
            )
          ))
          .limit(1);

        if (!opt) {
          try {
            const [newOpt] = await db
              .insert(categoryAttributeOptions)
              .values({
                attributeId: colorAttr.id,
                value: firstColor,
                label: firstColor,
                createdBy: sellerId,
                updatedBy: sellerId,
              })
              .returning();
            opt = newOpt;
          } catch {
            const [existingOpt] = await db
              .select()
              .from(categoryAttributeOptions)
              .where(and(
                eq(categoryAttributeOptions.attributeId, colorAttr.id),
                or(
                  eq(categoryAttributeOptions.value, firstColor),
                  eq(categoryAttributeOptions.label, firstColor),
                  ilike(categoryAttributeOptions.value, firstColor),
                  ilike(categoryAttributeOptions.label, firstColor)
                )
              ))
              .limit(1);
            opt = existingOpt;
          }
        }

        if (opt) {
          await db
            .insert(productVariantOptionsTable)
            .values({
              variantId: variant.id,
              attributeId: colorAttr.id,
              attributeOptionId: opt.id,
              createdBy: sellerId,
              updatedBy: sellerId,
            })
            .onConflictDoUpdate({
              target: [productVariantOptionsTable.variantId, productVariantOptionsTable.attributeId],
              set: {
                attributeOptionId: opt.id,
                updatedBy: sellerId,
                updatedAt: new Date(),
              },
            });
        }
      }
    }

    // 4. Upsert garment specs into categoryAttributeOptions, productAttributeValuesTable & productVariantOptionsTable
    const attributesToSave = [
      { key: "fabric", name: "Fabric Material", val: extraParams?.fabricMaterial },
      { key: "sleeves", name: "Sleeves Style", val: extraParams?.sleevesStyle },
      { key: "fit", name: "Fit Type", val: extraParams?.fitType },
      { key: "occasion", name: "Occasion Focus", val: extraParams?.occasionFocus },
      { key: "gender", name: "Gender Profile", val: extraParams?.genderProfile },
      { key: "age_group", name: "Target Age Group", val: extraParams?.targetAgeGroup },
    ];

    for (const item of attributesToSave) {
      if (item.val && typeof item.val === "string" && item.val.trim() && categoryId) {
        const valStr = item.val.trim();
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
              createdBy: sellerId,
              updatedBy: sellerId,
            })
            .returning();
          attr = newAttr;
        }

        if (attr) {
          // Find or create categoryAttributeOptions
          let [opt] = await db
            .select()
            .from(categoryAttributeOptions)
            .where(and(
              eq(categoryAttributeOptions.attributeId, attr.id),
              or(
                eq(categoryAttributeOptions.value, valStr),
                eq(categoryAttributeOptions.label, valStr),
                ilike(categoryAttributeOptions.value, valStr),
                ilike(categoryAttributeOptions.label, valStr)
              )
            ))
            .limit(1);

          if (!opt) {
            try {
              const [newOpt] = await db
                .insert(categoryAttributeOptions)
                .values({
                  attributeId: attr.id,
                  value: valStr,
                  label: valStr,
                  createdBy: sellerId,
                  updatedBy: sellerId,
                })
                .returning();
              opt = newOpt;
            } catch {
              const [existingOpt] = await db
                .select()
                .from(categoryAttributeOptions)
                .where(and(
                  eq(categoryAttributeOptions.attributeId, attr.id),
                  or(
                    eq(categoryAttributeOptions.value, valStr),
                    eq(categoryAttributeOptions.label, valStr),
                    ilike(categoryAttributeOptions.value, valStr),
                    ilike(categoryAttributeOptions.label, valStr)
                  )
                ))
                .limit(1);
              opt = existingOpt;
            }
          }

          // Upsert into productAttributeValuesTable
          await db
            .insert(productAttributeValuesTable)
            .values({
              productId,
              attributeId: attr.id,
              attributeOptionId: opt ? opt.id : null,
              valueText: valStr,
              displayValue: valStr,
              createdBy: sellerId,
              updatedBy: sellerId,
            })
            .onConflictDoUpdate({
              target: [productAttributeValuesTable.productId, productAttributeValuesTable.attributeId],
              set: {
                attributeOptionId: opt ? opt.id : null,
                valueText: valStr,
                displayValue: valStr,
                updatedBy: sellerId,
                updatedAt: new Date(),
              },
            });

          // Also upsert into productVariantOptionsTable (variant_attributes)
          if (opt) {
            await db
              .insert(productVariantOptionsTable)
              .values({
                variantId: variant.id,
                attributeId: attr.id,
                attributeOptionId: opt.id,
                createdBy: sellerId,
                updatedBy: sellerId,
              })
              .onConflictDoUpdate({
                target: [productVariantOptionsTable.variantId, productVariantOptionsTable.attributeId],
                set: {
                  attributeOptionId: opt.id,
                  updatedBy: sellerId,
                  updatedAt: new Date(),
                },
              });
          }
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
    reservedQuantity?: number | string;
    lastAdjustedAt?: string | Date;
    position?: number | string;
  },
  sellerId?: string
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
    if (extraParams?.position !== undefined && String(extraParams.position).trim() !== "") {
      variantUpdate.position = Number(extraParams.position) || 0;
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
    if (extraParams?.reservedQuantity !== undefined && String(extraParams.reservedQuantity).trim() !== "") {
      invUpdate.reservedQuantity = Number(extraParams.reservedQuantity) || 0;
    }
    invUpdate.lastAdjustedAt = extraParams?.lastAdjustedAt ? new Date(extraParams.lastAdjustedAt) : new Date();

    await db
      .update(inventoryTable)
      .set(invUpdate)
      .where(eq(inventoryTable.variantId, variant.id));
  }
}

export interface UpdateDraftDeliveryParams {
  packageWeight?: string | number;
  pickupHubId?: string | null;
  pickupHubAddress?: string;
  shippingPartnerId?: string | null;
  shippingMethodId?: string | null;
  deliveryZone?: string;
  deliveryRadiusRange?: string;
  estimatedDeliveryWindow?: string;
}

export async function updateDraftProductDelivery(
  productId: string,
  packageWeight?: string | number,
  deliveryMeta?: UpdateDraftDeliveryParams,
  sellerId?: string
) {
  const [variant] = await db
    .select()
    .from(productVariantsTable)
    .where(eq(productVariantsTable.productId, productId))
    .limit(1);

  if (variant) {
    const weightVal = packageWeight ? String(packageWeight) : "0.00";
    const weightG = Math.round(parseFloat(weightVal) * 1000) || 0;

    const variantUpdate: Record<string, unknown> = {
      weightGrams: weightG,
      updatedAt: new Date(),
    };
    if (deliveryMeta?.estimatedDeliveryWindow) {
      variantUpdate.estimatedDeliveryWindow = deliveryMeta.estimatedDeliveryWindow;
    }

    await db
      .update(productVariantsTable)
      .set(variantUpdate)
      .where(eq(productVariantsTable.id, variant.id));

    const metadata: Record<string, unknown> = {
      packageWeight: weightVal,
    };
    if (deliveryMeta?.pickupHubId !== undefined) metadata.pickupHubId = deliveryMeta.pickupHubId;
    if (deliveryMeta?.pickupHubAddress !== undefined) metadata.pickupHubAddress = deliveryMeta.pickupHubAddress;
    if (deliveryMeta?.shippingPartnerId !== undefined) metadata.shippingPartnerId = deliveryMeta.shippingPartnerId;
    if (deliveryMeta?.shippingMethodId !== undefined) metadata.shippingMethodId = deliveryMeta.shippingMethodId;
    if (deliveryMeta?.deliveryZone !== undefined) metadata.deliveryZone = deliveryMeta.deliveryZone;
    if (deliveryMeta?.deliveryRadiusRange !== undefined) metadata.deliveryRadiusRange = deliveryMeta.deliveryRadiusRange;
    if (deliveryMeta?.estimatedDeliveryWindow !== undefined) metadata.estimatedDeliveryWindow = deliveryMeta.estimatedDeliveryWindow;

    const shippingUpdate: Record<string, unknown> = {
      weight: weightVal,
      metadata,
      updatedAt: new Date(),
      ...(sellerId ? { updatedBy: sellerId } : {}),
    };

    await db
      .update(shippingTable)
      .set(shippingUpdate)
      .where(eq(shippingTable.variantId, variant.id));
  }
}

export interface UpdateDraftSeoParams {
  searchKeywords?: string;
  customVisibility?: "PUBLIC" | "PRIVATE" | "UNLISTED";
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string | null;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string | null;
  structuredData?: Record<string, unknown>;
}

export async function updateDraftProductSeo(
  productId: string,
  searchKeywords?: string,
  customVisibility?: "PUBLIC" | "PRIVATE" | "UNLISTED",
  seoOverrides?: Partial<UpdateDraftSeoParams>,
  sellerId?: string
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
      .set({
        visibility: customVisibility,
        updatedAt: new Date(),
      })
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

  const primaryImageUrl = primaryImage?.imageUrl || anyImage?.imageUrl || null;

  // Generate automated SEO bundle
  const generatedSeo = generateProductSeoData({
    productName: product?.name || "",
    brandName: product?.brandName,
    descriptionStory: product?.description,
    tags: keywords,
    primaryImageUrl,
  });

  const finalSlug = seoOverrides?.slug || product?.slug || generatedSeo.slug;
  const finalMetaTitle = seoOverrides?.metaTitle || generatedSeo.metaTitle;
  const finalMetaDescription = seoOverrides?.metaDescription || generatedSeo.metaDescription;
  const finalCanonicalUrl = seoOverrides?.canonicalUrl || generatedSeo.canonicalUrl;
  const finalOgTitle = seoOverrides?.ogTitle || generatedSeo.ogTitle;
  const finalOgDescription = seoOverrides?.ogDescription || generatedSeo.ogDescription;
  const finalOgImage = seoOverrides?.ogImage !== undefined ? seoOverrides.ogImage : generatedSeo.ogImage;
  const finalTwitterTitle = seoOverrides?.twitterTitle || generatedSeo.twitterTitle;
  const finalTwitterDescription = seoOverrides?.twitterDescription || generatedSeo.twitterDescription;
  const finalTwitterImage = seoOverrides?.twitterImage !== undefined ? seoOverrides.twitterImage : generatedSeo.twitterImage;
  const finalStructuredData = seoOverrides?.structuredData || generatedSeo.structuredData;

  // Upsert productSeoTable
  const [existingSeo] = await db
    .select({ id: productSeoTable.id })
    .from(productSeoTable)
    .where(eq(productSeoTable.productId, productId))
    .limit(1);

  if (existingSeo) {
    await db
      .update(productSeoTable)
      .set({
        slug: finalSlug,
        metaKeywords: keywords,
        metaTitle: finalMetaTitle,
        metaDescription: finalMetaDescription,
        canonicalUrl: finalCanonicalUrl,
        ogTitle: finalOgTitle,
        ogDescription: finalOgDescription,
        ogImage: finalOgImage,
        twitterTitle: finalTwitterTitle,
        twitterDescription: finalTwitterDescription,
        twitterImage: finalTwitterImage,
        structuredData: finalStructuredData,
        updatedAt: new Date(),
        ...(sellerId ? { updatedBy: sellerId } : {}),
      })
      .where(eq(productSeoTable.productId, productId));
  } else {
    await db
      .insert(productSeoTable)
      .values({
        productId,
        slug: finalSlug,
        metaKeywords: keywords,
        metaTitle: finalMetaTitle,
        metaDescription: finalMetaDescription,
        canonicalUrl: finalCanonicalUrl,
        ogTitle: finalOgTitle,
        ogDescription: finalOgDescription,
        ogImage: finalOgImage,
        twitterTitle: finalTwitterTitle,
        twitterDescription: finalTwitterDescription,
        twitterImage: finalTwitterImage,
        structuredData: finalStructuredData,
        createdBy: sellerId,
        updatedBy: sellerId,
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
          createdBy: sellerId,
          updatedBy: sellerId,
        })
        .onConflictDoNothing()
        .returning();
      tag = newTag;
    }

    if (!tag) {
      const [existingTag] = await db
        .select()
        .from(productTagsTable)
        .where(eq(productTagsTable.slug, tagSlug))
        .limit(1);
      tag = existingTag;
    }

    if (tag) {
      await db
        .insert(productTagMappingsTable)
        .values({
          productId,
          tagId: tag.id,
          createdBy: sellerId,
        })
        .onConflictDoNothing();
    }
  }
}

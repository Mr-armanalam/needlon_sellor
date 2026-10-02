import {AuthSeller} from "@/types/auth";
import { db } from "@/db";
import { productsTable } from "@/db/schema/catalog/products/table";
import { productVariantsTable } from "@/db/schema/catalog/products/product-variants/table";
import { inventoryTable } from "@/db/schema/catalog/products/inventory/table";
import { pricingTable } from "@/db/schema/catalog/products/pricing/table";
import { shippingTable } from "@/db/schema/catalog/products/shipping/table";
import { productSeoTable } from "@/db/schema/catalog/products/product-seo/table";
import { productImagesTable } from "@/db/schema/catalog/products/product-images/table";
import { productAiTable } from "@/db/schema/catalog/products/product-ai/table";
import { productVariantOptionsTable } from "@/db/schema/catalog/products/product-variant-options/table";
import { eq } from "drizzle-orm";
import { generateUniqueSlug } from "@/modules/shared/slug/generate-unique-slug";
import { existsProductSlug } from "./exists-product-slug";

export const createCloneProduct = async ({productId, seller}:{productId:string; seller: AuthSeller}) => {
    const [originalProduct] = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, productId))
        .limit(1);

    if (!originalProduct) {
        throw new Error(`Product with ID "${productId}" not found.`);
    }

    if (originalProduct.storeId !== seller.id && seller.role !== "admin") {
        throw new Error("Forbidden: You do not have permission to duplicate this product.");
    }

    const newName = `${originalProduct.name} - Copy`;
    const newSlug = await generateUniqueSlug(newName, (candidate) => existsProductSlug(candidate));

    const duplicated = await db.transaction(async (tx) => {
        // 1. Insert new master product
        const [newProduct] = await tx
            .insert(productsTable)
            .values({
                storeId: originalProduct.storeId,
                categoryId: originalProduct.categoryId,
                name: newName,
                slug: newSlug,
                shortDescription: originalProduct.shortDescription,
                description: originalProduct.description,
                status: "DRAFT", // reset duplicated to draft status
                visibility: originalProduct.visibility,
                productType: originalProduct.productType,
                isFeatured: originalProduct.isFeatured,
            })
            .returning();

        // 2. Fetch original variants and clone them
        const originalVariants = await tx
            .select()
            .from(productVariantsTable)
            .where(eq(productVariantsTable.productId, productId));

        for (const origVar of originalVariants) {
            const [newVar] = await tx
                .insert(productVariantsTable)
                .values({
                    productId: newProduct.id,
                    sku: `${origVar.sku}-COPY-${Date.now().toString().slice(-4)}`,
                    barcode: origVar.barcode ? `${origVar.barcode}-COPY` : null,
                    price: origVar.price,
                    compareAtPrice: origVar.compareAtPrice,
                    costPrice: origVar.costPrice,
                    weightGrams: origVar.weightGrams,
                    status: origVar.status,
                    position: origVar.position,
                })
                .returning();

            // Clone inventory
            const [origInv] = await tx
                .select()
                .from(inventoryTable)
                .where(eq(inventoryTable.variantId, origVar.id))
                .limit(1);

            if (origInv) {
                await tx.insert(inventoryTable).values({
                    variantId: newVar.id,
                    quantity: origInv.quantity,
                    lowStockThreshold: origInv.lowStockThreshold,
                    allowBackorder: origInv.allowBackorder,
                });
            }

            // Clone pricing
            const [origPricing] = await tx
                .select()
                .from(pricingTable)
                .where(eq(pricingTable.variantId, origVar.id))
                .limit(1);

            if (origPricing) {
                await tx.insert(pricingTable).values({
                    variantId: newVar.id,
                    price: origPricing.price,
                    compareAtPrice: origPricing.compareAtPrice,
                    costPrice: origPricing.costPrice,
                    currencyCode: origPricing.currencyCode,
                    isTaxInclusive: origPricing.isTaxInclusive,
                });
            }

            // Clone shipping
            const [origShipping] = await tx
                .select()
                .from(shippingTable)
                .where(eq(shippingTable.variantId, origVar.id))
                .limit(1);

            if (origShipping) {
                await tx.insert(shippingTable).values({
                    variantId: newVar.id,
                    weight: origShipping.weight,
                    weightUnit: origShipping.weightUnit,
                    length: origShipping.length,
                    width: origShipping.width,
                    height: origShipping.height,
                    dimensionUnit: origShipping.dimensionUnit,
                    requiresShipping: origShipping.requiresShipping,
                    isFreeShipping: origShipping.isFreeShipping,
                });
            }

            // Clone variant options mappings
            const origOptions = await tx
                .select({
                    attributeId: productVariantOptionsTable.attributeId,
                    attributeOptionId: productVariantOptionsTable.attributeOptionId,
                })
                .from(productVariantOptionsTable)
                .where(eq(productVariantOptionsTable.variantId, origVar.id));

            for (const opt of origOptions) {
                await tx.insert(productVariantOptionsTable).values({
                    variantId: newVar.id,
                    attributeId: opt.attributeId,
                    attributeOptionId: opt.attributeOptionId,
                });
            }
        }

        // 3. Clone SEO
        const [origSeo] = await tx
            .select()
            .from(productSeoTable)
            .where(eq(productSeoTable.productId, productId))
            .limit(1);

        if (origSeo) {
            await tx.insert(productSeoTable).values({
                productId: newProduct.id,
                slug: newSlug,
                metaTitle: origSeo.metaTitle ? `${origSeo.metaTitle} Copy` : null,
                metaDescription: origSeo.metaDescription,
                metaKeywords: origSeo.metaKeywords,
            });
        }

        // 4. Clone images
        const origImages = await tx
            .select()
            .from(productImagesTable)
            .where(eq(productImagesTable.productId, productId));

        for (const img of origImages) {
            await tx.insert(productImagesTable).values({
                productId: newProduct.id,
                imageUrl: img.imageUrl,
                storageKey: img.storageKey,
                displayOrder: img.displayOrder,
                isPrimary: img.isPrimary,
            });
        }

        // 5. Clone AI record
        const [origAi] = await tx
            .select()
            .from(productAiTable)
            .where(eq(productAiTable.productId, productId))
            .limit(1);

        if (origAi) {
            await tx.insert(productAiTable).values({
                productId: newProduct.id,
                summary: origAi.summary,
                qualityScore: origAi.qualityScore,
            });
        }

        return newProduct;
    });

    return duplicated
}

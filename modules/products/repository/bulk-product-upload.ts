import {successResponse} from "@/modules/shared/api/success-response";
import { db } from "@/db";
import { productsTable } from "@/db/schema/catalog/products/table";
import { productVariantsTable } from "@/db/schema/catalog/products/product-variants/table";
import { inventoryTable } from "@/db/schema/catalog/products/inventory/table";
import { pricingTable } from "@/db/schema/catalog/products/pricing/table";
import { shippingTable } from "@/db/schema/catalog/products/shipping/table";
import { productSeoTable } from "@/db/schema/catalog/products/product-seo/table";
import { productAiTable } from "@/db/schema/catalog/products/product-ai/table";
import { categoriesTable } from "@/db/schema/catalog/categories/table";
import { eq, sql } from "drizzle-orm";
import { generateUniqueSlug } from "@/modules/shared/slug/generate-unique-slug";
import { existsProductSlug } from "./exists-product-slug";
import { AuthSeller } from "@/types/auth";

export const bulkProductUpload = async ( seller: AuthSeller, items: any) => {
    const storeId = seller.id;
    const uploaded = [];

    // Run bulk uploads in a single transaction for efficiency and atomicity
    await db.transaction(async (tx) => {
        for (const item of items) {
            const name = item.name || "Bulk Product";
            const catName = item.category || "General";

            const rawPrice = item.retailPrice || item.price;
            const cleanPrice = parseFloat(String(rawPrice || '').replace(/[^0-9.]/g, ''));
            const price = !isNaN(cleanPrice) && cleanPrice >= 0 ? String(cleanPrice) : "0.00";

            const qty = Number(item.boutiqueStockCount || item.stock || item.quantity || 0);

            const rawWeight = item.packageWeight || item.weight;
            const cleanWeightNum = parseFloat(String(rawWeight || '').replace(/[^0-9.]/g, ''));
            const weight = !isNaN(cleanWeightNum) && cleanWeightNum > 0 ? String(cleanWeightNum) : "0.35";

            const baseSku = item.uniqueSku || `SKU-BULK-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;

            let categoryId: string | null = null;
            const existingCatRes: any = await tx.execute(
                sql`SELECT id FROM categories WHERE name = ${catName} LIMIT 1`
            );

            if (existingCatRes?.[0]?.id) {
                categoryId = existingCatRes[0].id;
            } else {
                throw new Error(`Category "${catName}" does not exist. Only administrators can create new categories.`);
            }

            // Generate slug
            const slug = await generateUniqueSlug(name, (candidate) => existsProductSlug(candidate));

            // Create product master
            const [prod] = await tx
                .insert(productsTable)
                .values({
                    storeId,
                    categoryId,
                    name,
                    slug,
                    shortDescription: item.brandLabel ? `Brand: ${item.brandLabel}` : null,
                    description: item.descriptionStory || null,
                    status: "PUBLISHED", // Published by default during bulk import
                    visibility: "PUBLIC",
                    isFeatured: false,
                })
                .returning();

            // Create variant
            const [variant] = await tx
                .insert(productVariantsTable)
                .values({
                    productId: prod.id,
                    sku: baseSku,
                    price,
                    weightGrams: Math.round(parseFloat(weight) * 1000) || 350,
                    position: 0,
                    status: "ACTIVE",
                })
                .returning();

            // Create inventory
            await tx.insert(inventoryTable).values({
                variantId: variant.id,
                quantity: qty,
                lowStockThreshold: 5,
            });

            // Create pricing
            await tx.insert(pricingTable).values({
                variantId: variant.id,
                price,
                currencyCode: "INR",
                isTaxInclusive: true,
            });

            // Create shipping
            await tx.insert(shippingTable).values({
                variantId: variant.id,
                weight,
                weightUnit: "KG",
                requiresShipping: true,
                isFreeShipping: false,
            });

            // Create SEO
            const keywords = item.searchKeywords
                ? item.searchKeywords.split(",").map((k: string) => k.trim())
                : [];

            await tx.insert(productSeoTable).values({
                productId: prod.id,
                slug,
                metaTitle: name,
                metaKeywords: keywords,
            });

            // Create default AI
            await tx.insert(productAiTable).values({
                productId: prod.id,
                summary: "",
                qualityScore: 0,
            });

            uploaded.push(prod);
        }
    });
    return uploaded;
}

import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { generateUniqueSlug } from "@/modules/shared/slug/generate-unique-slug";
import { existsProductSlug } from "@/modules/products/repository/queries/exists-product-slug";

export async function POST(request: NextRequest) {
  return routeHandler(async () => {
    const { products: items } = await request.json();
    if (!Array.isArray(items)) {
      throw new Error("Invalid payload: 'products' must be an array.");
    }

    const { db } = await import("@/db");
    const { productsTable } = await import("@/db/schema/catalog/products/table");
    const { productVariantsTable } = await import("@/db/schema/catalog/products/product-variants/table");
    const { inventoryTable } = await import("@/db/schema/catalog/products/inventory/table");
    const { pricingTable } = await import("@/db/schema/catalog/products/pricing/table");
    const { shippingTable } = await import("@/db/schema/catalog/products/shipping/table");
    const { productSeoTable } = await import("@/db/schema/catalog/products/product-seo/table");
    const { productAiTable } = await import("@/db/schema/catalog/products/product-ai/table");
    const { categoriesTable } = await import("@/db/schema/catalog/categories/table");
    const { eq } = await import("drizzle-orm");

    const storeId = "00000000-0000-0000-0000-000000000001";
    const uploaded = [];

    // Run bulk uploads in a single transaction for efficiency and atomicity
    await db.transaction(async (tx) => {
      for (const item of items) {
        const name = item.name || "Bulk Product";
        const catName = item.category || "General";
        const price = String(item.retailPrice || "0.00");
        const qty = Number(item.boutiqueStockCount || 0);
        const weight = String(item.packageWeight || "0.35");
        const baseSku = item.uniqueSku || `SKU-BULK-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;

        // Resolve Category
        let categoryId = null;
        const [existingCategory] = await tx
          .select({ id: categoriesTable.id })
          .from(categoriesTable)
          .where(eq(categoriesTable.name, catName))
          .limit(1);

        if (existingCategory) {
          categoryId = existingCategory.id;
        } else {
          const catSlug = await generateUniqueSlug(catName, async () => false);
          const [newCat] = await tx
            .insert(categoriesTable)
            .values({
              name: catName,
              slug: catSlug,
              code: `CAT-${catSlug.toUpperCase()}`,
              path: `/${catSlug}`,
              level: 0,
            })
            .returning();
          categoryId = newCat.id;
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

    return successResponse({ success: true, count: uploaded.length, items: uploaded }, 201);
  });
}

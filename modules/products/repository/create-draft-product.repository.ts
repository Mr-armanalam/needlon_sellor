import { db } from "@/db";
import { productsTable, Product, NewProduct } from "@/db/schema/catalog/products";

export async function createDraftProduct(data: any): Promise<Product> {
    let categoryId = data.categoryId;
    if (!categoryId) {
        const { categoriesTable } = await import("@/db/schema/catalog/categories");
        const [firstCategory] = await db
            .select({ id: categoriesTable.id })
            .from(categoriesTable)
            .limit(1);

        if (firstCategory) {
            categoryId = firstCategory.id;
        } else {
            const [newCat] = await db
                .insert(categoriesTable)
                .values({
                    name: "General",
                    slug: "general",
                    code: "CAT-GENERAL",
                    path: "/general",
                    level: 0,
                })
                .returning();
            categoryId = newCat.id;
        }
    }

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);

    const draftValues: NewProduct = {
        storeId: data?.sellerId || data?.storeId || "00000000-0000-0000-0000-000000000001",
        categoryId: categoryId,
        name: data.name || "Untitled Draft",
        slug: data.slug || `draft-${timestamp}-${randomSuffix}`,
        status: data.status || "DRAFT",
    };

    const product = await db.transaction(async (tx) => {
        const [prod] = await tx
            .insert(productsTable)
            .values(draftValues)
            .returning();

        // Create default variant
        const { productVariantsTable } = await import("@/db/schema/catalog/products/product-variants/table");
        const [variant] = await tx
            .insert(productVariantsTable)
            .values({
                productId: prod.id,
                sku: `sku-${prod.id}`,
                price: "0.00",
                position: 0,
                status: "ACTIVE",
            })
            .returning();

        // Create default inventory
        const { inventoryTable } = await import("@/db/schema/catalog/products/inventory/table");
        await tx.insert(inventoryTable).values({
            variantId: variant.id,
            quantity: 0,
            lowStockThreshold: 5,
        });

        // Create default pricing
        const { pricingTable } = await import("@/db/schema/catalog/products/pricing/table");
        await tx.insert(pricingTable).values({
            variantId: variant.id,
            price: "0.00",
            currencyCode: "INR",
            isTaxInclusive: true,
        });

        // Create default shipping
        const { shippingTable } = await import("@/db/schema/catalog/products/shipping/table");
        await tx.insert(shippingTable).values({
            variantId: variant.id,
            weight: "0.00",
            weightUnit: "KG",
            requiresShipping: true,
            isFreeShipping: false,
        });

        // Create default SEO
        const { productSeoTable } = await import("@/db/schema/catalog/products/product-seo/table");
        await tx.insert(productSeoTable).values({
            productId: prod.id,
            slug: prod.slug,
            metaTitle: prod.name,
            metaDescription: "",
        });

        // Create default AI record
        const { productAiTable } = await import("@/db/schema/catalog/products/product-ai/table");
        await tx.insert(productAiTable).values({
            productId: prod.id,
            summary: "",
            qualityScore: 0,
        });

        return prod;
    });

    return product;
}

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

    const sellerId = data?.sellerId || data?.storeId || "00000000-0000-0000-0000-000000000001";

    const draftValues: NewProduct = {
        storeId: sellerId,
        categoryId: categoryId,
        name: data.name || "Untitled Draft",
        slug: data.slug || `draft-${timestamp}-${randomSuffix}`,
        status: data.status || "DRAFT",
        visibility: data.visibility || "PUBLIC",
    };

    const product = await db.transaction(async (tx) => {
        // Ensure seller_store exists
        const { sellerStore } = await import("@/db/schema/seller/seller-store");
        const { eq } = await import("drizzle-orm");
        const [existingStore] = await tx
            .select()
            .from(sellerStore)
            .where(eq(sellerStore.sellerId, sellerId))
            .limit(1);

        if (!existingStore) {
            const { seller } = await import("@/db/schema/seller");
            const [sellerRecord] = await tx
                .select()
                .from(seller)
                .where(eq(seller.id, sellerId))
                .limit(1);
            
            const storeName = sellerRecord?.name ? `${sellerRecord.name} Store` : "Boutique Store";
            const storeSlug = `store-${sellerId.substring(0, 8)}-${Math.random().toString(36).substring(2, 6)}`;
            
            await tx.insert(sellerStore).values({
                sellerId,
                storeName,
                storeSlug,
                status: "ACTIVE",
                visibility: "PUBLIC",
            });
        }

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
                name: "Standard Variant",
                sku: `sku-${prod.id}`,
                position: 0,
                status: "ACTIVE",
            })
            .returning();

        // Create default inventory
        const { inventoryTable } = await import("@/db/schema/catalog/products/inventory/table");
        await tx.insert(inventoryTable).values({
            variantId: variant.id,
            quantity: 0,
            lowStockThreshold: 0,
        });

        // Create default pricing (authoritative store)
        const { pricingTable } = await import("@/db/schema/catalog/products/pricing/table");
        await tx.insert(pricingTable).values({
            variantId: variant.id,
            price: "0.00",
            currencyCode: "INR",
            isTaxInclusive: true,
            createdBy: sellerId,
            updatedBy: sellerId,
        });

        // Create default shipping
        const { shippingTable } = await import("@/db/schema/catalog/products/shipping/table");
        await tx.insert(shippingTable).values({
            variantId: variant.id,
            weight: "0.00",
            weightUnit: "KG",
            requiresShipping: true,
            isFreeShipping: false,
            createdBy: sellerId,
            updatedBy: sellerId,
        });

        // Create default SEO
        const { productSeoTable } = await import("@/db/schema/catalog/products/product-seo/table");
        await tx.insert(productSeoTable).values({
            productId: prod.id,
            slug: prod.slug,
            metaTitle: prod.name,
            metaDescription: "",
            metaKeywords: [],
            createdBy: sellerId,
            updatedBy: sellerId,
        });

        return prod;
    });

    return product;
}

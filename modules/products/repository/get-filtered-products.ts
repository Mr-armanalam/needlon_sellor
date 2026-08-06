import { db } from "@/db";
import { productsTable } from "@/db/schema/catalog/products/table";
import { productVariantsTable } from "@/db/schema/catalog/products/product-variants/table";
import { inventoryTable } from "@/db/schema/catalog/products/inventory/table";
import { pricingTable } from "@/db/schema/catalog/products/pricing/table";
import { categoriesTable } from "@/db/schema/catalog/categories/table";
import { productImagesTable } from "@/db/schema/catalog/products/product-images/table";
import { and, eq, ilike, isNull, isNotNull, or, gte, lte, sql, inArray } from "drizzle-orm";

export const getFilteredProducts = async (searchParams: URLSearchParams, sellerId: string) => {

    const rawStatus = searchParams.get("status") || "ALL";
    const statusTab = rawStatus.toUpperCase().replaceAll(" ", "_").trim();
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const size = searchParams.get("size");
    const priceRange = searchParams.get("priceRange"); // e.g. "under_1000", "1000_3000", "above_3000"
    const stockStatus = searchParams.get("stockStatus"); // e.g. "in_stock", "low_stock", "out_of_stock"
    const sort = searchParams.get("sort"); // e.g. "price_asc", "price_desc", "newest"

    const conditions: any[] = [];

    // Filter by seller store ID
    conditions.push(eq(productsTable.storeId, sellerId));

    // Status Tab Filtering Logic
    if (statusTab === "ARCHIVED") {
        conditions.push(or(isNotNull(productsTable.deletedAt), eq(productsTable.status, "ARCHIVED")));
    } else {
        conditions.push(isNull(productsTable.deletedAt));

        if (statusTab === "ACTIVE") {
            conditions.push(eq(productsTable.status, "PUBLISHED"));
            conditions.push(gte(inventoryTable.quantity, 1));
        } else if (statusTab === "DRAFT") {
            conditions.push(eq(productsTable.status, "DRAFT"));
        } else if (statusTab === "OUT_OF_STOCK" || statusTab.includes("OUT")) {
            conditions.push(eq(productsTable.status, "PUBLISHED"));
            conditions.push(or(eq(inventoryTable.quantity, 0), isNull(inventoryTable.quantity)));
        }
    }

    // Live search query
    if (search) {
        conditions.push(
            or(
                ilike(productsTable.name, `%${search}%`),
                ilike(productsTable.description, `%${search}%`),
                ilike(productVariantsTable.sku, `%${search}%`)
            )
        );
    }

    // Category filter
    if (category && category !== "All" && category !== "Category") {
        conditions.push(
            or(
                eq(categoriesTable.name, category),
                ilike(productsTable.shortDescription, `%${category}%`)
            )
        );
    }

    // Size filter
    if (size && size !== "Size") {
        conditions.push(
            or(
                ilike(productVariantsTable.sku, `%${size}%`),
                ilike(productsTable.description, `%${size}%`)
            )
        );
    }

    // Stock status dropdown filter
    if (stockStatus && stockStatus !== "Stock Status") {
        if (stockStatus === "in_stock") {
            conditions.push(gte(inventoryTable.quantity, 1));
        } else if (stockStatus === "low_stock") {
            conditions.push(and(gte(inventoryTable.quantity, 1), lte(inventoryTable.quantity, 5)));
        } else if (stockStatus === "out_of_stock") {
            conditions.push(or(eq(inventoryTable.quantity, 0), isNull(inventoryTable.quantity)));
        }
    }

    // Price range dropdown filter with safe numeric SQL cast
    const numPrice = sql`COALESCE(
      NULLIF(regexp_replace(${pricingTable.price}::text, '[^0-9.]', '', 'g'), '')::numeric,
      NULLIF(regexp_replace(${productVariantsTable.price}::text, '[^0-9.]', '', 'g'), '')::numeric,
      0
    )`;

    if (priceRange && priceRange !== "Price Range") {
        if (priceRange === "under_1000" || (priceRange.includes("1000") && priceRange.includes("under"))) {
            conditions.push(sql`${numPrice} > 0 AND ${numPrice} <= 1000`);
        } else if (priceRange === "1000_3000" || priceRange.includes("1000")) {
            conditions.push(sql`${numPrice} >= 1000 AND ${numPrice} <= 3000`);
        } else if (priceRange === "above_3000" || priceRange.includes("3000")) {
            conditions.push(sql`${numPrice} >= 3000`);
        }
    }

    // Dynamic sorting
    let orderByClause: any = sql`${productsTable.createdAt} DESC`;
    if (sort === "price_asc") {
        orderByClause = sql`${numPrice} ASC`;
    } else if (sort === "price_desc") {
        orderByClause = sql`${numPrice} DESC`;
    }

    // Fetch products joining categories, and variant/pricing/inventory conditionally to optimize performance
    let rows: any[] = [];
    console.time("  -> [getFilteredProducts] DB SELECT products");

    const needsVariants = (search && search.trim() !== "") || (size && size !== "Size") || (priceRange && priceRange !== "Price Range") || (sort === "price_asc" || sort === "price_desc");
    const needsInventory = (statusTab === "ACTIVE" || statusTab === "OUT_OF_STOCK" || statusTab.includes("OUT")) || (stockStatus && stockStatus !== "Stock Status");
    const needsPricing = (priceRange && priceRange !== "Price Range") || (sort === "price_asc" || sort === "price_desc");

    if (needsVariants || needsInventory || needsPricing) {
        rows = await db
            .select({
                product: {
                    id: productsTable.id,
                    name: productsTable.name,
                    slug: productsTable.slug,
                    status: productsTable.status,
                    visibility: productsTable.visibility,
                    isFeatured: productsTable.isFeatured,
                    createdAt: productsTable.createdAt,
                    updatedAt: productsTable.updatedAt,
                    shortDescription: productsTable.shortDescription,
                },
                category: {
                    name: categoriesTable.name,
                },
                variant: {
                    id: productVariantsTable.id,
                    sku: productVariantsTable.sku,
                    price: productVariantsTable.price,
                    compareAtPrice: productVariantsTable.compareAtPrice,
                    weightGrams: productVariantsTable.weightGrams,
                },
                inventory: {
                    quantity: inventoryTable.quantity,
                    lowStockThreshold: inventoryTable.lowStockThreshold,
                },
                pricing: {
                    price: pricingTable.price,
                    compareAtPrice: pricingTable.compareAtPrice,
                },
            })
            .from(productsTable)
            .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
            .leftJoin(productVariantsTable, eq(productVariantsTable.productId, productsTable.id))
            .leftJoin(inventoryTable, eq(inventoryTable.variantId, productVariantsTable.id))
            .leftJoin(pricingTable, eq(pricingTable.variantId, productVariantsTable.id))
            .where(and(...conditions))
            .orderBy(orderByClause);
    } else {
        rows = await db
            .select({
                product: {
                    id: productsTable.id,
                    name: productsTable.name,
                    slug: productsTable.slug,
                    status: productsTable.status,
                    visibility: productsTable.visibility,
                    isFeatured: productsTable.isFeatured,
                    createdAt: productsTable.createdAt,
                    updatedAt: productsTable.updatedAt,
                    shortDescription: productsTable.shortDescription,
                },
                category: {
                    name: categoriesTable.name,
                },
            })
            .from(productsTable)
            .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
            .where(and(...conditions))
            .orderBy(orderByClause);
    }
    console.timeEnd("  -> [getFilteredProducts] DB SELECT products");

    if (rows.length === 0) {
        return new Map<string, any>();
    }

    const productIds = Array.from(new Set(rows.map(row => row.product.id)));

    // Check which metric tables exist in public schema first to prevent PgBouncer connection hangs on missing relations
    const checkTables = await db.execute(sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_name IN ('user_view_history', 'wishlist_items', 'order_items', 'product_media')
    `).catch(() => []);
    const checkRows = ((checkTables as any)?.rows || checkTables || []) as Array<{ table_name: string }>;
    const existingTables = new Set(checkRows.map(r => r.table_name));

    // Fetch all bulk data concurrently to save time on network latency
    const randId = Math.floor(Math.random() * 1000);
    const [
        variantsList,
        imagesList,
        viewsResult,
        likesResult,
        ordersResult
    ] = await Promise.all([
        (async () => {
            const label = `    -> [Bulk Fetch #${randId}] variants`;
            console.time(label);
            const res = await db
                .select()
                .from(productVariantsTable)
                .where(inArray(productVariantsTable.productId, productIds))
                .catch(() => []);
            console.timeEnd(label);
            return res;
        })(),
        (async () => {
            if (!existingTables.has("product_media")) return [];
            const label = `    -> [Bulk Fetch #${randId}] images`;
            console.time(label);
            const res = await db
                .select({
                    productId: productImagesTable.productId,
                    imageUrl: productImagesTable.imageUrl
                })
                .from(productImagesTable)
                .where(inArray(productImagesTable.productId, productIds))
                .catch(() => []);
            console.timeEnd(label);
            return res;
        })(),
        (async () => {
            if (!existingTables.has("user_view_history")) return [];
            const label = `    -> [Bulk Fetch #${randId}] views`;
            console.time(label);
            const res = await db.execute(
                sql`SELECT product_id, COUNT(*)::int as count FROM user_view_history WHERE product_id IN (${sql.join(productIds, sql`, `)}) GROUP BY product_id`
            ).catch(() => []);
            console.timeEnd(label);
            return res;
        })(),
        (async () => {
            if (!existingTables.has("wishlist_items")) return [];
            const label = `    -> [Bulk Fetch #${randId}] likes`;
            console.time(label);
            const res = await db.execute(
                sql`SELECT product_id, COUNT(*)::int as count FROM wishlist_items WHERE product_id IN (${sql.join(productIds, sql`, `)}) GROUP BY product_id`
            ).catch(() => []);
            console.timeEnd(label);
            return res;
        })(),
        (async () => {
            if (!existingTables.has("order_items")) return [];
            const label = `    -> [Bulk Fetch #${randId}] orders`;
            console.time(label);
            const res = await db.execute(
                sql`SELECT product_id, COALESCE(SUM(quantity), 0)::int as count FROM order_items WHERE product_id IN (${sql.join(productIds, sql`, `)}) GROUP BY product_id`
            ).catch(() => []);
            console.timeEnd(label);
            return res;
        })()
    ]);

    // Fetch inventory and pricing in bulk for the variants found
    console.time("  -> [getFilteredProducts] Variant Metrics Bulk Fetch");
    const variantIds = (variantsList || []).map(v => v.id);
    let inventoryList: any[] = [];
    let pricingList: any[] = [];

    if (variantIds.length > 0) {
        const [invRes, prRes] = await Promise.all([
            db
                .select()
                .from(inventoryTable)
                .where(inArray(inventoryTable.variantId, variantIds))
                .catch(() => []),
            db
                .select()
                .from(pricingTable)
                .where(inArray(pricingTable.variantId, variantIds))
                .catch(() => [])
        ]);
        inventoryList = invRes;
        pricingList = prRes;
    }
    console.timeEnd("  -> [getFilteredProducts] Variant Metrics Bulk Fetch");

    // Map images
    const imageMap = new Map<string, string>();
    for (const img of (imagesList || [])) {
        if (img && !imageMap.has(img.productId)) {
            let primaryImage = img.imageUrl || undefined;
            if (primaryImage && primaryImage.startsWith("blob:")) {
                primaryImage = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600";
            }
            if (primaryImage) {
                imageMap.set(img.productId, primaryImage);
            }
        }
    }

    // Map views
    const viewsMap = new Map<string, number>();
    const viewsRows = ((viewsResult as any)?.rows || viewsResult || []) as unknown as Array<{ product_id: string; count: number }>;
    for (const r of viewsRows) {
        if (r && r.product_id) viewsMap.set(r.product_id, r.count);
    }

    // Map likes
    const likesMap = new Map<string, number>();
    const likesRows = ((likesResult as any)?.rows || likesResult || []) as unknown as Array<{ product_id: string; count: number }>;
    for (const r of likesRows) {
        if (r && r.product_id) likesMap.set(r.product_id, r.count);
    }

    // Map orders
    const ordersMap = new Map<string, number>();
    const ordersRows = ((ordersResult as any)?.rows || ordersResult || []) as unknown as Array<{ product_id: string; count: number }>;
    for (const r of ordersRows) {
        if (r && r.product_id) ordersMap.set(r.product_id, r.count);
    }

    // Map variants, inventory, and pricing in memory
    const variantsByProductId = new Map<string, any[]>();
    for (const v of (variantsList || [])) {
        if (v && v.productId) {
            if (!variantsByProductId.has(v.productId)) {
                variantsByProductId.set(v.productId, []);
            }
            variantsByProductId.get(v.productId)!.push(v);
        }
    }

    const inventoryByVariantId = new Map<string, any>();
    for (const inv of (inventoryList || [])) {
        if (inv && inv.variantId) {
            inventoryByVariantId.set(inv.variantId, inv);
        }
    }

    const pricingByVariantId = new Map<string, any>();
    for (const pr of (pricingList || [])) {
        if (pr && pr.variantId) {
            pricingByVariantId.set(pr.variantId, pr);
        }
    }

    // Group and deduplicate products by ID
    const productMap = new Map<string, any>();

    for (const row of rows) {
        if (!productMap.has(row.product.id)) {
            const primaryImage = imageMap.get(row.product.id);
            const views = viewsMap.get(row.product.id) ?? 0;
            const likes = likesMap.get(row.product.id) ?? 0;
            const orders = ordersMap.get(row.product.id) ?? 0;

            const productVariants = variantsByProductId.get(row.product.id) || [];
            
            // Map the variants with their pricing
            const variants = productVariants.map(v => {
                const pr = pricingByVariantId.get(v.id);
                return {
                    id: v.id,
                    sku: v.sku,
                    price: pr?.price || v.price || "0.00",
                    compareAtPrice: pr?.compareAtPrice || v.compareAtPrice || null,
                    weightGrams: v.weightGrams,
                };
            });

            // Get inventory of the first variant or general inventory
            const firstVariantId = productVariants[0]?.id;
            const inv = firstVariantId ? inventoryByVariantId.get(firstVariantId) : null;
            const inventory = inv 
                ? { quantity: inv.quantity, lowStockThreshold: inv.lowStockThreshold }
                : { quantity: 0 };

            productMap.set(row.product.id, {
                id: row.product.id,
                name: row.product.name,
                slug: row.product.slug,
                status: row.product.status,
                visibility: row.product.visibility,
                isFeatured: row.product.isFeatured,
                createdAt: row.product.createdAt,
                updatedAt: row.product.updatedAt,
                category: row.category?.name || "General",
                shortDescription: row.product.shortDescription || "Boutique Item",
                primaryImage,
                views,
                likes,
                orders,
                variants,
                inventory,
            });
        }
    }

    return productMap;
}

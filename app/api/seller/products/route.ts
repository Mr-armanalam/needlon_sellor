import { NextRequest, NextResponse } from "next/server";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { errorResponse } from "@/modules/shared/api/error-response";
import { db } from "@/db";
import { productsTable } from "@/db/schema/catalog/products/table";
import { productVariantsTable } from "@/db/schema/catalog/products/product-variants/table";
import { inventoryTable } from "@/db/schema/catalog/products/inventory/table";
import { pricingTable } from "@/db/schema/catalog/products/pricing/table";
import { categoriesTable } from "@/db/schema/catalog/categories/table";
import { productImagesTable } from "@/db/schema/catalog/products/product-images/table";
import { and, eq, ilike, isNull, isNotNull, or, gte, lte, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const seller = await getCurrentSeller();
    if (!seller || !seller.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Unauthorized: Only authenticated sellers can view or list products.",
          },
        },
        { status: 401 }
      );
    }
    const sellerId = seller.id;

    const { searchParams } = new URL(req.url);
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

    // Fetch products joining categories, variants, inventory, and pricing
    const rows = await db
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

    // Group and deduplicate products by ID
    const productMap = new Map<string, any>();

    for (const row of rows) {
      if (!productMap.has(row.product.id)) {
        // Fetch primary image
        const images = await db
          .select({ imageUrl: productImagesTable.imageUrl })
          .from(productImagesTable)
          .where(eq(productImagesTable.productId, row.product.id))
          .limit(1);

        let primaryImage = images[0]?.imageUrl || undefined;
        if (primaryImage && primaryImage.startsWith("blob:")) {
          primaryImage = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600";
        }

        // Fetch DB metrics
        const viewsRows: any = await db.execute(
          sql`SELECT COUNT(*)::int as count FROM user_view_history WHERE product_id = ${row.product.id}`
        );
        const likesRows: any = await db.execute(
          sql`SELECT COUNT(*)::int as count FROM wishlist_items WHERE product_id = ${row.product.id}`
        );
        const ordersRows: any = await db.execute(
          sql`SELECT COALESCE(SUM(quantity), 0)::int as count FROM order_items WHERE product_id = ${row.product.id}`
        );

        const views = viewsRows?.[0]?.count ?? 0;
        const likes = likesRows?.[0]?.count ?? 0;
        const orders = ordersRows?.[0]?.count ?? 0;

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
          variants: row.variant
            ? [
                {
                  id: row.variant.id,
                  sku: row.variant.sku,
                  price: row.pricing?.price || row.variant.price || "0.00",
                  compareAtPrice: row.pricing?.compareAtPrice || row.variant.compareAtPrice || null,
                  weightGrams: row.variant.weightGrams,
                },
              ]
            : [],
          inventory: row.inventory
            ? {
                quantity: row.inventory.quantity,
                lowStockThreshold: row.inventory.lowStockThreshold,
              }
            : { quantity: 0 },
        });
      }
    }

    const items = Array.from(productMap.values());

    return NextResponse.json({
      success: true,
      data: {
        items,
        nextCursor: null,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

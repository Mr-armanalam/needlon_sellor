import { db } from "@/db";
import { getMockProductsWithCategory } from "@/lib/mock-data-provider";
import { orderItems } from "@/db/schema/order-items";
import { productCategory } from "@/db/schema/product-category";
import { productItems } from "@/db/schema/product-items";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { unionAll } from "drizzle-orm/pg-core";
import { cookies } from "next/headers";
import { gte } from "drizzle-orm";

export async function getNewSectionProduct({
  type,
}: {
  type: "best-sellers" | "trending" | "arrivals" | null | string;
}) {
  try {
    let data;
    const cookie = await cookies();
    const cookieStore = cookie.toString();

    switch (type) {
      case "best-sellers":
        const getBestSellerQuery = (type: string, category: string) => {
          return db
            .select({
              product: productItems,
              totalSales: sql<number>`count(${orderItems.id})`.as(
                "total_sales",
              ),
              Category: {
                categoryName: productCategory.category,
                categoryType: productCategory.CatType,
              },
            })
            .from(productItems)
            .leftJoin(orderItems, eq(productItems.id, orderItems.productId))
            .leftJoin(
              productCategory,
              eq(productItems.categoryId, productCategory.id),
            )
            .where(
              and(
                ilike(productCategory.CatType, type),
                ilike(productCategory.category, category),
              ),
            )
            .groupBy(
              productItems.id,
              productCategory.category,
              productCategory.CatType,
            )
            .orderBy((t) => desc(t.totalSales))
            .limit(5);
        };

        const mensFormalBestSellerQuery = getBestSellerQuery("men", "formal");
        const mensOuterBestSellerQuery = getBestSellerQuery(
          "men",
          "outerwears",
        );
        const womensFormalBestSellerQuery = getBestSellerQuery(
          "women",
          "formal",
        );
        const womensOuterBestSellerQuery = getBestSellerQuery(
          "women",
          "outerwears",
        );

        data = await unionAll(
          mensFormalBestSellerQuery,
          mensOuterBestSellerQuery,
          womensFormalBestSellerQuery,
          womensOuterBestSellerQuery,
        );

        break;

      case "trending": {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // 1. Reusable Trending Query Function
        const getTrendingCategory = (type: string, category: string) => {
          return db
            .select({
              Category: {
                categoryName: productCategory.category,
                categoryType: productCategory.CatType,
              },
              product: productItems,
              // Calculate sales count from the last 7 days
              totalSales: sql<number>`count(${orderItems.id})`.as(
                "total_sales",
              ),
            })
            .from(productItems)
            .leftJoin(
              orderItems,
              and(
                eq(productItems.id, orderItems.productId),
                gte(orderItems.createdAt, sevenDaysAgo),
              ),
            )
            .leftJoin(
              productCategory,
              eq(productItems.categoryId, productCategory.id),
            )
            .where(
              and(
                eq(productCategory.CatType, type),
                eq(productCategory.category, category),
              ),
            )
            .groupBy(
              productItems.id,
              productCategory.id,
              productCategory.category,
              productCategory.CatType,
            )
            .orderBy(desc(sql`total_sales`), desc(productItems.averageRating))
            .limit(10);
        };

        // 2. Execute all 4 sections
        data = await unionAll(
          getTrendingCategory("men", "formal"),
          getTrendingCategory("men", "outerwears"),
          getTrendingCategory("women", "formal"),
          getTrendingCategory("women", "outerwears"),
        );
        break;
      }

      case "arrivals":
        const getCategoryQuery = (type: string, category: string) => {
          return db
            .select({
              Category: {
                categoryName: productCategory.category,
                categoryType: productCategory.CatType,
              },
              product: productItems,
            })
            .from(productItems)
            .leftJoin(
              productCategory,
              eq(productItems.categoryId, productCategory.id),
            )
            .where(
              and(
                ilike(productCategory.CatType, type),
                ilike(productCategory.category, category),
              ),
            )
            .orderBy(desc(productItems.createdAt))
            .limit(5);
        };

        const mensFormal = getCategoryQuery("men", "formal");
        const mensOuter = getCategoryQuery("men", "outerwears");
        const womensFormal = getCategoryQuery("women", "formal");
        const womensOuter = getCategoryQuery("women", "outerwears");

        data = await unionAll(mensFormal, mensOuter, womensFormal, womensOuter);

        break;

      default:
        break;
    }

    return (data && data.length > 0) ? data : getMockProductsWithCategory();
  } catch (error) {
    console.warn("DB query failed in getNewSectionProduct, using mock fallback data:", error);
    return getMockProductsWithCategory();
  }
}

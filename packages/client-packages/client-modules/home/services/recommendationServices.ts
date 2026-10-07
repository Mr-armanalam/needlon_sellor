import { db } from "@/db";
import { productItems } from "@/db/schema/product-items";
import { orderItems } from "@/db/schema/order-items";
import { eq, desc, inArray, sql } from "drizzle-orm";
import { MOCK_PRODUCTS } from "@/lib/mock-data-provider";

export const fetchProductsByCategory = async (categoryIds: string[], limit: number) => {
  try {
    const res = await db
      .select()
      .from(productItems)
      .where(inArray(productItems.categoryId, categoryIds))
      .orderBy(desc(productItems.averageRating))
      .limit(limit);
    return res.length ? res : MOCK_PRODUCTS.slice(0, limit);
  } catch {
    return MOCK_PRODUCTS.slice(0, limit);
  }
};

export const getTrendingProducts = async () => {
  try {
    const res = await db
      .select({ product: productItems })
      .from(orderItems)
      .innerJoin(productItems, eq(orderItems.productId, productItems.id))
      .groupBy(productItems.id)
      .orderBy(desc(sql`COUNT(${orderItems.productId})`))
      .limit(10);
    const mapped = res.map((p) => p.product);
    return mapped.length ? mapped : MOCK_PRODUCTS;
  } catch {
    return MOCK_PRODUCTS;
  }
};

export const getNewArrivals = async (limit = 12) => {
  try {
    const res = await db.select().from(productItems).orderBy(desc(productItems.createdAt)).limit(limit);
    return res.length ? res : MOCK_PRODUCTS.slice(0, limit);
  } catch {
    return MOCK_PRODUCTS.slice(0, limit);
  }
};

export const getTopRated = async (limit = 12) => {
  try {
    const res = await db.select().from(productItems).orderBy(desc(productItems.averageRating)).limit(limit);
    return res.length ? res : MOCK_PRODUCTS.slice(0, limit);
  } catch {
    return MOCK_PRODUCTS.slice(0, limit);
  }
};
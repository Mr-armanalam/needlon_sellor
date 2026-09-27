import { db } from "@/db";
import { orders } from "@/db/schema/orders/table";
import { reviewsTable } from "@/db/schema/reviews/table";
import { productsTable } from "@/db/schema/catalog/products/table";
import { and, eq, isNull, sql } from "drizzle-orm";

export async function getSellerCustomersData(sellerId: string, search?: string) {
  const conditions = [
    eq(orders.sellerId, sellerId),
    isNull(orders.deletedAt),
  ];

  if (search) {
    conditions.push(sql`${orders.buyerName} ILIKE ${`%${search}%`}`);
  }

  const rows = await db
    .select({
      buyerId: orders.buyerId,
      buyerName: orders.buyerName,
      buyerEmail: orders.buyerEmail,
      buyerPhone: orders.buyerPhone,
      totalOrders: sql<number>`COUNT(*)::int`,
      totalSpent: sql<string>`COALESCE(SUM(${orders.grandTotal}), 0)`,
      lastOrderAt: sql<Date>`MAX(${orders.createdAt})`,
    })
    .from(orders)
    .where(and(...conditions))
    .groupBy(orders.buyerId, orders.buyerName, orders.buyerEmail, orders.buyerPhone)
    .orderBy(sql`MAX(${orders.createdAt}) DESC`);

  return rows.map((r) => ({
    buyerId: r.buyerId,
    buyerName: r.buyerName || "Customer",
    buyerEmail: r.buyerEmail || "",
    buyerPhone: r.buyerPhone || null,
    totalOrders: r.totalOrders,
    totalSpent: parseFloat(r.totalSpent || "0").toFixed(2),
    lastOrderAt: r.lastOrderAt
      ? r.lastOrderAt instanceof Date
        ? r.lastOrderAt.toISOString()
        : new Date(r.lastOrderAt).toISOString()
      : new Date().toISOString(),
  }));
}

export async function getCustomerDetailsRepo(sellerId: string, buyerId: string) {
  const customerOrders = await db
    .select({
      id: orders.orderNumber,
      orderId: orders.id,
      date: orders.createdAt,
      total: orders.grandTotal,
      status: orders.status,
    })
    .from(orders)
    .where(and(eq(orders.sellerId, sellerId), eq(orders.buyerId, buyerId), isNull(orders.deletedAt)))
    .orderBy(sql`${orders.createdAt} DESC`)
    .limit(10);

  const customerReviews = await db
    .select({
      id: reviewsTable.id,
      rating: reviewsTable.rating,
      comment: reviewsTable.content,
      date: reviewsTable.createdAt,
      productName: productsTable.name,
    })
    .from(reviewsTable)
    .leftJoin(productsTable, eq(reviewsTable.productId, productsTable.id))
    .where(and(eq(reviewsTable.sellerId, sellerId), eq(reviewsTable.buyerId, buyerId), isNull(reviewsTable.deletedAt)))
    .orderBy(sql`${reviewsTable.createdAt} DESC`)
    .limit(10);

  return {
    history: customerOrders.map((o) => ({
      id: o.id,
      orderId: o.orderId,
      date: o.date ? new Date(o.date).toLocaleDateString() : "N/A",
      total: `₹${parseFloat(o.total || "0").toFixed(2)}`,
      status: o.status,
    })),
    reviews: customerReviews.map((r) => ({
      id: r.id,
      rating: r.rating || 5,
      comment: r.comment || "No comment provided.",
      product: r.productName || "Purchased Product",
      date: r.date ? new Date(r.date).toLocaleDateString() : "N/A",
    })),
  };
}

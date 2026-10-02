import { db } from "@/db";
import { orders } from "@/db/schema/orders/table";
import { reviews } from "@/db/schema/review/reviews";
import { productsTable } from "@/db/schema/catalog/products/table";
import { usersTable } from "@/db/schema/users";
import { and, eq, isNull, sql } from "drizzle-orm";

export async function getSellerCustomersData(sellerId: string, search?: string) {
  const conditions = [
    eq(orders.sellerId, sellerId),
    isNull(orders.deletedAt),
  ];

  if (search) {
    const term = `%${search}%`;
    conditions.push(
      sql`(${orders.buyerName} ILIKE ${term} OR ${orders.buyerEmail} ILIKE ${term} OR ${orders.buyerPhone} ILIKE ${term})`
    );
  }

  const rows = await db
    .select({
      buyerId: orders.buyerId,
      buyerName: orders.buyerName,
      buyerEmail: orders.buyerEmail,
      buyerPhone: orders.buyerPhone,
      buyerAvatar: usersTable.imageUrl,
      totalOrders: sql<number>`COUNT(*)::int`,
      totalSpent: sql<string>`COALESCE(SUM(${orders.grandTotal}), 0)`,
      lastOrderAt: sql<Date>`MAX(${orders.createdAt})`,
    })
    .from(orders)
    .leftJoin(usersTable, eq(orders.buyerId, usersTable.id))
    .where(and(...conditions))
    .groupBy(orders.buyerId, orders.buyerName, orders.buyerEmail, orders.buyerPhone, usersTable.imageUrl)
    .orderBy(sql`MAX(${orders.createdAt}) DESC`);


  return rows.map((r) => ({
    buyerId: r.buyerId,
    buyerName: r.buyerName || "Customer",
    buyerEmail: r.buyerEmail || "",
    buyerPhone: r.buyerPhone || null,
    buyerAvatar: r.buyerAvatar || null,
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
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.reviewText,
      date: reviews.createdAt,
      productName: productsTable.name,
    })
    .from(reviews)
    .leftJoin(productsTable, eq(reviews.productId, productsTable.id))
    .where(and(eq(reviews.sellerId, sellerId), eq(reviews.buyerId, buyerId)))
    .orderBy(sql`${reviews.createdAt} DESC`)
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

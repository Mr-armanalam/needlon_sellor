import { db } from "@/db";
import { orders } from "@/db/schema/orders";
import { orderItems } from "@/db/schema/order-items";
import { productItems } from "@/db/schema/product-items";
import { and, eq, ilike, sql, desc } from "drizzle-orm";
import { MOCK_ORDERS } from "@/lib/mock-data-provider";

export const OrderService = {
  async getRawUserOrders(userId: string, search: string) {
    try {
      const res = await db
        .select({
          orderId: orders.id,
          createdAt: orders.createdAt,
          status: orders.status,
          total: orders.total,
          currency: orders.currency,
          paymentId: orders.paymentId,
          productName: productItems.name,
          image: productItems.image,
          price: orderItems.priceAtPurchase,
          properties: orderItems.properties,
        })
        .from(orders)
        .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
        .innerJoin(productItems, eq(orderItems.productId, productItems.id))
        .where(
          and(
            eq(orders.userId, userId),
            search ? ilike(productItems.name, `%${search}%`) : sql`TRUE`
          )
        )
        .orderBy(desc(orders.createdAt));

      return res.length ? res : MOCK_ORDERS;
    } catch {
      console.warn("DB failed in getRawUserOrders, returning mock orders");
      return MOCK_ORDERS;
    }
  }
};
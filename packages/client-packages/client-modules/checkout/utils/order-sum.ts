'use server'
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function computeOrderSums(orderId: string) {
try {
    const [result] = await db.execute(
      sql`
        SELECT
          COALESCE(SUM(price_at_purchase * quantity), 0) AS items_total,
          COALESCE(SUM(COALESCE(shipping_charge, 0)), 0) AS shipping_total
        FROM order_items
        WHERE order_id = ${orderId}
      `
    );
  
    return {
      itemsTotal: Number(result?.items_total || 0),
      shippingTotal: Number(result?.shipping_total || 0),
    };
} catch (error) {
  console.log(error);
  throw error;
}
}
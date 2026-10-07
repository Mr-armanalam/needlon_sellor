'use server'

import { db } from "@/db";
import { computeOrderSums } from "./order-sum";
import { orders } from "@/db/schema/orders";
import { eq } from "drizzle-orm";

export async function recalcAndStoreOrderTotal(orderId: string, podCharge = 0, discountAmountRupees = 0, percentDiscount?: number) {
  try {
    const { itemsTotal, shippingTotal } = await computeOrderSums(orderId); 
    const subtotal = itemsTotal + shippingTotal + Number(podCharge || 0);
  
    let discountApplied = 0;
    if (typeof percentDiscount === "number" && !Number.isNaN(percentDiscount) && percentDiscount > 0) {
      discountApplied = Math.round((subtotal * percentDiscount) / 100);
    } else if (discountAmountRupees && discountAmountRupees > 0) {
      discountApplied = Math.round(Number(discountAmountRupees));
    }
  
    const total = Math.max(0, Math.round(subtotal - discountApplied));
  
    await db
      .update(orders)
      .set({
        total,
        pod_charge: podCharge,
        coupon_discount: discountApplied,
      })
      .where(eq(orders.id, orderId));
  
    return { itemsTotal, shippingTotal, subtotal, discountApplied, total };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
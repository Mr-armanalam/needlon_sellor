/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { orders } from "@/db/schema/orders";
import { orderItems } from "@/db/schema/order-items";
import { eq, sql } from "drizzle-orm";
import { recalcAndStoreOrderTotal } from "@/modules/checkout/utils/recal-storeOrder";
import { createStripeCoupon } from "@/modules/checkout/services/create-strip-coupon";
import { mapCartToLineItems } from "@/modules/checkout/services/map-cart-to-line-items";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export async function POST(req: Request) {
  try {
    const {
      cartItems,          
      currentAddressId,
      userId,
      couponId,
      discountAmount,     
      percentDiscount,   
      invoice,
      paymentMode = "card", 
    } = await req.json();

    if (!userId || !currentAddressId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const podChargeForOrder = paymentMode === "pod" ? (typeof (req as any).podCharge === "number" ? (req as any).podCharge : 50) : 0;

    const [order] = await db
      .insert(orders)
      .values({
        userId,
        shipping_address: currentAddressId,
        couponId: couponId || null,
        total: 0,                
        status: "PENDING",
        mrp_price: 0,
        pod_charge: podChargeForOrder,
      })
      .returning();

    //Insert order_items (with per-item shipping charges)
    const itemData = cartItems.map((item: any) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      priceAtPurchase: Math.round(Number(item.price)),
      properties: item.properties || null,
      invoice: invoice || null,
      shipping_charge: Math.round(Number(item.shippingCharge || 0)),
      delivery_date: sql`NOW() + interval '7 days'`,
    }));

    await db.insert(orderItems).values(itemData);

    
    const { itemsTotal, shippingTotal, subtotal, discountApplied, total } =
      await recalcAndStoreOrderTotal(order.id, podChargeForOrder, discountAmount ?? 0, percentDiscount);
  
    const stripeCouponId = await createStripeCoupon(percentDiscount, discountAmount);
    const line_items = mapCartToLineItems(cartItems, podChargeForOrder);
    
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      discounts: stripeCouponId ? [{ coupon: stripeCouponId }] : [],
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
      metadata: {
        orderId: String(order.id),
        userId: String(userId),
        couponId: couponId || "",
        verified_items_total: String(itemsTotal),
        verified_shipping_total: String(shippingTotal),
        verified_pod_charge: String(podChargeForOrder),
        coupon_discount: String(discountApplied),
        amount_total: String(total),
      },
    });
    
    await db
      .update(orders)
      .set({ paymentId: session.id, total })
      .where(eq(orders.id, order.id));

    
    return NextResponse.json({ url: session.url, orderId: order.id, total });
  } catch (error: any) {
    console.error("❌ Checkout Error:", error);
    return NextResponse.json({ error: "Checkout failed", details: error?.message || String(error) }, { status: 500 });
  }
}

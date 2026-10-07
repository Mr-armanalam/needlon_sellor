import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { orders } from "@/db/schema/orders";
import { and, eq, sql } from "drizzle-orm";
import { coupons } from "@/db/schema/coupons";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

async function buffer(readable: ReadableStream<Uint8Array>) {
  const reader = readable.getReader();
  const chunks = [];
  let result;
  while (!(result = await reader.read()).done) chunks.push(result.value);
  return Buffer.concat(chunks);
}

// Helper: update coupon usage if valid
async function updateCouponUsage(userId: string, couponId: string) {
  const [coupon] = await db
    .select()
    .from(coupons)
    .where(
      and(
        eq(coupons.id, couponId),
        eq(coupons.userId, userId),
        eq(coupons.isActive, true),
        sql`${coupons.expiresAt} > NOW()`,
        sql`${coupons.usedCount} < ${coupons.maxUses}`
      )
    );

  if (!coupon) {
    console.warn("⚠️ Coupon invalid, expired, or maxed out:", couponId);
    return;
  }

  await db
    .update(coupons)
    .set({
      usedCount: sql`${coupons.usedCount} + 1`,
      isActive: sql`CASE WHEN ${coupons.usedCount} + 1 >= ${coupons.maxUses} THEN false ELSE ${coupons.isActive} END`,
    })
    .where(eq(coupons.id, couponId));

}

export async function POST(req: Request) {
  const body = await buffer(req.body!);
  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed.", err);
    return new Response(`Webhook Error: ${err}`, { status: 400 });
  }
  const session = event.data.object as Stripe.Checkout.Session;
  const paymentStatus = session.payment_status;

  if (event.type === "checkout.session.completed") {
    const coupon_discount = session.metadata?.coupon_discount;

    const orderId = session.metadata?.orderId;
    const userId = session.metadata?.userId ?? "";
    const couponId = session.metadata?.couponId ?? "";
    const verified_pod_charge = session.metadata?.verified_pod_charge ?? "0";
    const amount_total = session.amount_total;

    if (orderId && amount_total) {
      await db
        .update(orders)
        .set({
          status: paymentStatus,
          total: Math.round(Number(amount_total) / 100),
          coupon_discount: Math.round(Number(coupon_discount) / 100),
          pod_charge: Math.round(Number(verified_pod_charge)/100)
        })
        .where(eq(orders.id, orderId));
    }

    if (couponId) {
      await updateCouponUsage(userId, couponId);
    }
  }

  if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await db
        .update(orders)
        .set({ status: paymentStatus })
        .where(eq(orders.id, orderId));
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

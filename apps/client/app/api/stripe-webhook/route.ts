import { NextRequest, NextResponse } from "next/server";
import { OrderCreationService } from "@/modules/orders/services/order-creation-service";
import { CartService } from "@/modules/cart/services/cart-service";
import { db } from "@needlon/db";
import { orderPayments } from "@needlon/db/db/schema/orders/order-payments/table";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const sig = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (webhookSecret && sig && stripeKey) {
      const stripe = new Stripe(stripeKey, {
        apiVersion: "2024-12-18.acacia" as any,
      });
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      // Direct JSON parsing for development / testing environments
      event = JSON.parse(rawBody);
    }

    // Handle checkout session completion
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // 1. Check idempotency: avoid double-creating orders
      if (process.env.DATABASE_URL) {
        const [existingPayment] = await db
          .select({ id: orderPayments.id })
          .from(orderPayments)
          .where(eq(orderPayments.gatewayPaymentId, session.id))
          .limit(1);

        if (existingPayment) {
          return NextResponse.json({ received: true, alreadyProcessed: true }, { status: 200 });
        }
      }

      const metadata = session.metadata || {};
      const userId = metadata.userId;
      const addressId = metadata.addressId;
      const couponCode = metadata.couponCode;
      const couponDiscount = Number(metadata.couponDiscount) || 0;

      // Retrieve buyer cart items from DB or metadata fallback
      let cartItems: any[] = [];
      if (userId) {
        cartItems = await CartService.getCart(userId);
      }

      if ((!cartItems || cartItems.length === 0) && metadata.cartSummary) {
        try {
          const parsed = JSON.parse(metadata.cartSummary);
          if (Array.isArray(parsed)) {
            cartItems = parsed.map((it: any) => ({
              productId: it.p,
              quantity: it.q,
              size: it.s,
              color: it.c,
              price: it.pr,
              name: it.n,
            }));
          }
        } catch {
          // ignore parsing error
        }
      }

      await OrderCreationService.createOrderFromCheckoutSession({
        sessionId: session.id,
        buyerId: userId || "guest-buyer",
        buyerAddressId: addressId,
        cartItems: cartItems.map((ci) => ({
          productId: ci.productId,
          quantity: ci.quantity,
          size: ci.size,
          color: ci.color,
          price: ci.price,
          name: ci.name,
          image: ci.image,
        })),
        couponCode,
        couponDiscount,
        paymentMethod: "CARD",
        paymentGateway: "STRIPE",
        currency: (session.currency || "INR").toUpperCase(),
      });
    }

    return NextResponse.json({ received: true, success: true }, { status: 200 });
  } catch (err: any) {
    console.error("STRIPE_WEBHOOK_ERROR:", err.message);
    return NextResponse.json({ error: err.message || "Webhook processing failed" }, { status: 400 });
  }
}

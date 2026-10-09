import { NextRequest, NextResponse } from "next/server";
import { OrderCreationService } from "@/modules/orders/services/order-creation-service";
import { CartService } from "@/modules/cart/services/cart-service";
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
      const metadata = session.metadata || {};
      const userId = metadata.userId;
      const addressId = metadata.addressId;
      const couponCode = metadata.couponCode;
      const couponDiscount = Number(metadata.couponDiscount) || 0;

      // Retrieve buyer cart items
      let cartItems: any[] = [];
      if (userId) {
        cartItems = await CartService.getCart(userId);
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

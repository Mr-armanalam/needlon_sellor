"use server";

import { db } from "@needlon/db";
import { orders } from "@needlon/db/db/schema/orders/table";
import { orderItems } from "@needlon/db/db/schema/orders/order-items/table";
import { orderPayments } from "@needlon/db/db/schema/orders/order-payments/table";
import { eq, or } from "drizzle-orm";
import { OrderCreationService } from "@/modules/orders/services/order-creation-service";
import { CartService } from "@/modules/cart/services/cart-service";

export const getOrderFromDB = async (sessionId: string) => {
  if (!process.env.DATABASE_URL || !sessionId) {
    return {
      line_items: null,
      Payment: null,
    };
  }

  try {
    // 1. Search for payment record by session ID or transaction ID in DB
    const [paymentRecord] = await db
      .select()
      .from(orderPayments)
      .where(
        or(
          eq(orderPayments.gatewayPaymentId, sessionId),
          eq(orderPayments.transactionId, sessionId),
          eq(orderPayments.paymentNumber, sessionId)
        )
      )
      .limit(1);

    if (paymentRecord) {
      // 2. Fetch parent order
      const [orderRecord] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, paymentRecord.orderId))
        .limit(1);

      // 3. Fetch line items
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, paymentRecord.orderId));

      return {
        line_items: {
          data: items.map((item) => ({
            quantity: item.quantity,
            description: `${item.productName}${item.variantName ? ` (${item.variantName})` : ""}`,
          })),
        },
        Payment: {
          status: "paid",
          paymentAmount: Number(paymentRecord.amount),
          orderId: orderRecord?.orderNumber || paymentRecord.orderId,
        },
      };
    }

    // 4. Self-Healing: If record not in DB yet and session is from Stripe, verify and create order directly
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (sessionId.startsWith("cs_") && stripeKey && !stripeKey.includes("placeholder") && stripeKey.startsWith("sk_")) {
      try {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" as any });
        const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] });

        if (session && session.payment_status === "paid") {
          const metadata = session.metadata || {};
          const userId = metadata.userId;
          const addressId = metadata.addressId;
          const couponCode = metadata.couponCode;
          const couponDiscount = Number(metadata.couponDiscount) || 0;

          let cartItems: any[] = [];
          if (metadata.cartSummary) {
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
              // ignore parse errors
            }
          }

          if (cartItems.length === 0 && userId) {
            cartItems = await CartService.getCart(userId);
          }

          if (cartItems.length === 0 && session.line_items?.data) {
            cartItems = session.line_items.data.map((li: any) => ({
              productId: li.id,
              quantity: li.quantity || 1,
              price: (li.amount_total || 249900) / 100 / (li.quantity || 1),
              name: li.description || "Needlon Tailored Product",
            }));
          }

          // Atomically persist order into PostgreSQL
          await OrderCreationService.createOrderFromCheckoutSession({
            sessionId: session.id,
            buyerId: userId || "guest-buyer",
            buyerAddressId: addressId,
            cartItems,
            couponCode,
            couponDiscount,
            paymentMethod: "CARD",
            paymentGateway: "STRIPE",
            currency: (session.currency || "INR").toUpperCase(),
          });

          // Fetch the newly created record
          const [newPayment] = await db
            .select()
            .from(orderPayments)
            .where(eq(orderPayments.gatewayPaymentId, session.id))
            .limit(1);

          if (newPayment) {
            const [newOrder] = await db
              .select()
              .from(orders)
              .where(eq(orders.id, newPayment.orderId))
              .limit(1);

            const newItems = await db
              .select()
              .from(orderItems)
              .where(eq(orderItems.orderId, newPayment.orderId));

            return {
              line_items: {
                data: newItems.map((item) => ({
                  quantity: item.quantity,
                  description: `${item.productName}${item.variantName ? ` (${item.variantName})` : ""}`,
                })),
              },
              Payment: {
                status: "paid",
                paymentAmount: Number(newPayment.amount),
                orderId: newOrder?.orderNumber || newPayment.orderId,
              },
            };
          }
        }
      } catch (stripeErr: any) {
        console.warn("Direct Stripe session reconciliation warning:", stripeErr.message);
      }
    }

    // 5. Fallback search by order number
    const [orderRecord] = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, sessionId))
      .limit(1);

    if (orderRecord) {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderRecord.id));

      return {
        line_items: {
          data: items.map((item) => ({
            quantity: item.quantity,
            description: `${item.productName}${item.variantName ? ` (${item.variantName})` : ""}`,
          })),
        },
        Payment: {
          status: "paid",
          paymentAmount: Number(orderRecord.grandTotal),
          orderId: orderRecord.orderNumber,
        },
      };
    }

    return {
      line_items: null,
      Payment: null,
    };
  } catch (err) {
    console.warn("getOrderFromDB error:", (err as Error).message);
    return {
      line_items: null,
      Payment: null,
    };
  }
};

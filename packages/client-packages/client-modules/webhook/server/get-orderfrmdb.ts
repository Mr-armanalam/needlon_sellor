"use server";
import { db } from "@/db";
import { orders } from "@/db/schema/orders";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export const getOrderFromDB = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent", "line_items.data.price.product"],
  });

  if (!session.line_items) throw Error("Something is wrong");

  const [order] = await db
    .select({
      status: orders.status,
      paymentAmount: orders.total,
      orderId: orders.id,
    })
    .from(orders)
    .where(eq(orders.paymentId, sessionId));

  if (!order) throw Error("Unauthorised session");

  return { line_items: session.line_items, Payment: order };
};

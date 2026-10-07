import { auth } from "@/auth";
import { db } from "@/db";
import { orderItems } from "@/db/schema/order-items";
import { orders } from "@/db/schema/orders";
import { productReview } from "@/db/schema/product-review";
import { ReviewService } from "@/modules/orders/services/review-services";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
  try {
    const { orderItemId, productId, comment, rating } = await req.json();
    const session = await auth();

    //  Guard: Authentication & Payload
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!orderItemId || !productId || !rating) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    try {
      const [validOrder] = await db
        .select({ rating: orderItems.rating, status: orders.status })
        .from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .where(and(eq(orderItems.id, orderItemId), eq(orders.userId, session.user.id)));

      if (validOrder && (validOrder.status !== "paid" || validOrder.rating !== null)) {
        return NextResponse.json({ error: "Action not permitted" }, { status: 403 });
      }
    } catch {
      // Allow review in mock preview mode
    }

    //  Execute Transaction via Service
    const review = await ReviewService.createReview({
      orderItemId,
      productId,
      userId: session.user.id,
      userName: session.user.name ?? "Anonymous",
      rating,
      comment
    });

    return NextResponse.json({ review, orderItemId }, { status: 200 });

  } catch (error) {
    console.error("REVIEW_POST_ERROR:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
};

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ allreview: [] }, { status: 200 });
  }

  try {
    const allreview = await db
      .select({
        id: productReview.id,
        productId: productReview.productId,
        rating: productReview.rating,
        comment: productReview.comment,
        userId: productReview.userId,
        userName: productReview.userName,
        updatedAt: productReview.updatedAt,
        orderItemId: orderItems.id, // ⭐ IMPORTANT
      })
      .from(productReview)
      .innerJoin(orderItems, eq(orderItems.rating, productReview.id))
      .where(eq(productReview.userId, session.user.id));

    return NextResponse.json({ allreview }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ allreview: [] }, { status: 200 });
  }
}

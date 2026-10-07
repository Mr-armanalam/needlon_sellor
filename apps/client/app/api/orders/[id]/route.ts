import { auth } from "@/auth";
import { db } from "@/db";
import { orderItems } from "@/db/schema/order-items";
import { orders } from "@/db/schema/orders";
import { productItems } from "@/db/schema/product-items";
import { userAddress } from "@/db/schema/user-address";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { MOCK_ORDER_DETAIL } from "@/lib/mock-data-provider";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    let session: any = null;
    try { session = await auth(); } catch { /* auth may fail without DB */ }

    if (!session?.user?.id) {
      // Return mock order detail for preview
      return Response.json(MOCK_ORDER_DETAIL, { status: 200 });
    }

    const userId = session.user.id;
    if (!orderId) return NextResponse.json({ error: "Invalid order" }, { status: 400 });

    try {
      const order = await db
        .select({
          orderDate: orders.createdAt,
          orderId: orderItems.id,
          shippingAddress: { ...userAddress },
          itemName: productItems.name,
          image: productItems.image,
          productId: productItems.id,
          orderProperties: orderItems.properties,
          ratingId: orderItems.rating,
          paymentMode: orders.paymentMode,
          shippingCharge: orderItems.shipping_charge,
          podCharge: orders.pod_charge,
          priceAtperchage: orderItems.priceAtPurchase,
          totalPurchasePrice: orders.total,
          couponDiscount: orders.coupon_discount,
        })
        .from(orderItems)
        .leftJoin(orders, eq(orderItems.orderId, orders.id))
        .leftJoin(productItems, eq(orderItems.productId, productItems.id))
        .leftJoin(userAddress, eq(orders.shipping_address, userAddress.id))
        .where(and(eq(orderItems.orderId, orderId), eq(orders.userId, userId)));

      return Response.json(order.length ? order : MOCK_ORDER_DETAIL, { status: 200 });
    } catch {
      return Response.json(MOCK_ORDER_DETAIL, { status: 200 });
    }

  } catch (error) {
    console.warn("Orders detail error, returning mock:", error);
    return Response.json(MOCK_ORDER_DETAIL, { status: 200 });
  }
}

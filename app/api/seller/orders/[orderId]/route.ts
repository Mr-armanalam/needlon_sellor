import { NextRequest, NextResponse } from "next/server";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { errorResponse } from "@/modules/shared/api/error-response";
import { db } from "@/db";
import { orders } from "@/db/schema/orders/table";
import { orderItems } from "@/db/schema/orders/order-items/table";
import { orderAddresses } from "@/db/schema/orders/order-address";
import { orderStatusHistory } from "@/db/schema/orders/order-status-history/table";
import { orderPayments } from "@/db/schema/orders/order-payments/table";
import { and, eq, isNull } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const seller = await getCurrentSeller();
    if (!seller || !seller.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Unauthorized: Only authenticated sellers can view order details.",
          },
        },
        { status: 401 }
      );
    }
    const sellerId = seller.id;
    const { orderId } = await params;

    // Fetch order header
    const orderList = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.sellerId, sellerId), isNull(orders.deletedAt)))
      .limit(1);

    if (orderList.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Order not found.",
          },
        },
        { status: 404 }
      );
    }

    const order = orderList[0];

    // Fetch order items
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    // Fetch order address snapshots
    const addresses = await db
      .select()
      .from(orderAddresses)
      .where(eq(orderAddresses.orderId, orderId));

    // Fetch order status history
    const history = await db
      .select()
      .from(orderStatusHistory)
      .where(eq(orderStatusHistory.orderId, orderId))
      .orderBy(orderStatusHistory.changedAt);

    // Fetch order payments
    const payments = await db
      .select()
      .from(orderPayments)
      .where(eq(orderPayments.orderId, orderId))
      .orderBy(orderPayments.createdAt);

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        items,
        addresses,
        history,
        payments,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

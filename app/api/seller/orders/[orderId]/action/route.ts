import { NextRequest, NextResponse } from "next/server";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { errorResponse } from "@/modules/shared/api/error-response";
import { db } from "@/db";
import { orders } from "@/db/schema/orders/table";
import { orderStatusHistory } from "@/db/schema/orders/order-status-history/table";
import { and, eq, isNull } from "drizzle-orm";

export async function POST(
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
            message: "Unauthorized: Only authenticated sellers can perform actions on orders.",
          },
        },
        { status: 401 }
      );
    }
    const sellerId = seller.id;
    const { orderId } = await params;

    const body = await req.json();
    const { action, remarks } = body;

    // Fetch order
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
    const fromStatus = order.status;
    let toStatus = fromStatus;
    const updateData: any = {};

    if (action === "ADVANCE") {
      if (fromStatus === "PENDING") {
        toStatus = "CONFIRMED";
        updateData.acceptedAt = new Date();
      } else if (fromStatus === "CONFIRMED") {
        toStatus = "PROCESSING";
        updateData.packedAt = new Date();
      } else if (fromStatus === "PROCESSING") {
        toStatus = "READY_TO_SHIP";
        updateData.readyAt = new Date();
      } else if (fromStatus === "READY_TO_SHIP") {
        toStatus = "OUT_FOR_DELIVERY";
        updateData.shippedAt = new Date();
      } else if (fromStatus === "OUT_FOR_DELIVERY" || fromStatus === "SHIPPED") {
        toStatus = "COMPLETED";
        updateData.deliveredAt = new Date();
      } else {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "BAD_REQUEST",
              message: `Cannot advance pipeline from state ${fromStatus}.`,
            },
          },
          { status: 400 }
        );
      }
    } else if (action === "CANCEL") {
      toStatus = "CANCELLED";
      updateData.cancelledAt = new Date();
    } else {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "Invalid action. Supported actions: ADVANCE, CANCEL.",
          },
        },
        { status: 400 }
      );
    }

    updateData.status = toStatus;
    updateData.updatedAt = new Date();

    let historyAction: any = "UPDATED";
    if (toStatus === "CONFIRMED") historyAction = "ACCEPTED";
    else if (toStatus === "PROCESSING") historyAction = "PACKED";
    else if (toStatus === "READY_TO_SHIP") historyAction = "READY_FOR_SHIPMENT";
    else if (toStatus === "OUT_FOR_DELIVERY") historyAction = "OUT_FOR_DELIVERY";
    else if (toStatus === "COMPLETED") historyAction = "DELIVERED";
    else if (toStatus === "CANCELLED") historyAction = "CANCELLED";

    // Perform transaction
    await db.transaction(async (tx) => {
      // Update order
      await tx
        .update(orders)
        .set(updateData)
        .where(eq(orders.id, orderId));

      // Insert status history log
      await tx.insert(orderStatusHistory).values({
        orderId: orderId,
        sellerId: sellerId,
        fromStatus: fromStatus,
        toStatus: toStatus,
        action: historyAction,
        source: "SELLER",
        result: "SUCCESS",
        remarks: remarks || `Order status updated from ${fromStatus} to ${toStatus} via ${action} action.`,
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        fromStatus,
        toStatus,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

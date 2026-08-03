import { db } from "@/db";
import { orders } from "@/db/schema/orders/table";
import { orderStatusHistory } from "@/db/schema/orders/order-status-history/table";
import { and, eq, isNull } from "drizzle-orm";
import {NotFoundError} from "@/modules/shared/errors";
import {BadRequestError} from "@/modules/shared/errors/bad-request-error";

export const updateOrderStatus = async ({orderId, sellerId, action, remarks}: {orderId: string, sellerId: string, action: string, remarks: string}) => {
    // Fetch order
    const orderList = await db
        .select()
        .from(orders)
        .where(and(eq(orders.id, orderId), eq(orders.sellerId, sellerId), isNull(orders.deletedAt)))
        .limit(1);

    if (orderList.length === 0) {
        throw new NotFoundError(`Order with ID ${orderId} not found for seller ${sellerId}.`);
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
            throw new BadRequestError(`Cannot advance order status from ${fromStatus}.`);
        }
    } else if (action === "CANCEL") {
        toStatus = "CANCELLED";
        updateData.cancelledAt = new Date();
    } else {
        throw new BadRequestError(`Invalid action. Supported actions: ADVANCE, CANCEL.`);
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

    return {fromStatus, toStatus};
}
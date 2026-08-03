import { db } from "@/db";
import { orders } from "@/db/schema/orders/table";
import { orderItems } from "@/db/schema/orders/order-items/table";
import { orderAddresses } from "@/db/schema/orders/order-address";
import { orderStatusHistory } from "@/db/schema/orders/order-status-history/table";
import { orderPayments } from "@/db/schema/orders/order-payments/table";
import { and, eq, isNull } from "drizzle-orm";
import {NotFoundError} from "@/modules/shared/errors";

export const getOrderById = async (orderId: string, sellerId: string) => {
    // Fetch order header
    const orderList = await db
        .select()
        .from(orders)
        .where(and(eq(orders.id, orderId), eq(orders.sellerId, sellerId), isNull(orders.deletedAt)))
        .limit(1);

    if (orderList.length === 0) {
     throw new NotFoundError("Order not found.");
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

    return {
        order,
        items,
        addresses,
        history,
        payments,
    };
}
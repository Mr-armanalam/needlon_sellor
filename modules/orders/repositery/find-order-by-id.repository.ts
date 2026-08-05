import { orders } from "@/db/schema/orders/table";
import { orderItems } from "@/db/schema/orders/order-items/table";
import { orderAddresses } from "@/db/schema/orders/order-address";
import { orderStatusHistory } from "@/db/schema/orders/order-status-history/table";
import { orderPayments } from "@/db/schema/orders/order-payments/table";
import { and, eq, isNull } from "drizzle-orm";
import { OrderNotFoundError } from "../errors/order-not-found-error";
import { DbTransaction } from "@/db/transactions";
import { getDatabase } from "@/db/database";

interface FindOrderByIdParams {
    orderId: string;
    sellerId: string;
    tx?: DbTransaction;
}

export const findOrderById = async ({
    orderId,
    sellerId,
    tx,
}: FindOrderByIdParams) => {
    const database = getDatabase(tx);

    // Fetch order header
    const orderList = await database
        .select()
        .from(orders)
        .where(and(eq(orders.id, orderId), eq(orders.sellerId, sellerId), isNull(orders.deletedAt)))
        .limit(1);

    if (orderList.length === 0) {
        throw new OrderNotFoundError(orderId);
    }

    const order = orderList[0];

    // Fetch order items
    const items = await database
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));

    // Fetch order address snapshots
    const addresses = await database
        .select()
        .from(orderAddresses)
        .where(eq(orderAddresses.orderId, orderId));

    // Fetch order status history
    const history = await database
        .select()
        .from(orderStatusHistory)
        .where(eq(orderStatusHistory.orderId, orderId))
        .orderBy(orderStatusHistory.changedAt);

    // Fetch order payments
    const payments = await database
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
};

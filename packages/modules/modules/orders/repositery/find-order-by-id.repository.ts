import { orders } from "@/db/schema/orders/table";
import { orderItems } from "@/db/schema/orders/order-items/table";
import { orderAddresses } from "@/db/schema/orders/order-address";
import { orderStatusHistory } from "@/db/schema/orders/order-status-history/table";
import { orderPayments } from "@/db/schema/orders/order-payments/table";
import { customerMeasurementsTable } from "@/db/schema/customization/measurements";
import { shipmentOrders } from "@/db/schema/delivery/shipping-orders";
import { and, desc, eq, inArray, isNull, or } from "drizzle-orm";
import { OrderNotFoundError } from "../errors/order-not-found-error";
import { DeliveryExecutiveAssignment, OrderShipmentDomain } from "../types";
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

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
    const lookupCondition = isUuid ? eq(orders.id, orderId) : eq(orders.orderNumber, orderId);

    // Fetch order header
    const orderList = await database
        .select()
        .from(orders)
        .where(and(lookupCondition, eq(orders.sellerId, sellerId), isNull(orders.deletedAt)))
        .limit(1);

    if (orderList.length === 0) {
        throw new OrderNotFoundError(orderId);
    }

    const order = orderList[0];
    const actualOrderId = order.id;

    // Fetch order items
    const items = await database
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, actualOrderId));

    // Fetch order address snapshots
    const addresses = await database
        .select()
        .from(orderAddresses)
        .where(eq(orderAddresses.orderId, actualOrderId));

    // Fetch order status history
    const history = await database
        .select()
        .from(orderStatusHistory)
        .where(eq(orderStatusHistory.orderId, actualOrderId))
        .orderBy(orderStatusHistory.changedAt);

    // Fetch order payments
    const payments = await database
        .select()
        .from(orderPayments)
        .where(eq(orderPayments.orderId, actualOrderId))
        .orderBy(orderPayments.createdAt);

    // Fetch bespoke customer measurements if associated with this order
    let measurements = await database
        .select()
        .from(customerMeasurementsTable)
        .where(eq(customerMeasurementsTable.orderId, actualOrderId))
        .limit(1);

    if (measurements.length === 0 && items.length > 0) {
        const itemIds = items.map((i) => i.id).filter(Boolean);
        if (itemIds.length > 0) {
            measurements = await database
                .select()
                .from(customerMeasurementsTable)
                .where(inArray(customerMeasurementsTable.orderItemId, itemIds))
                .limit(1);
        }
    }

    if (measurements.length === 0 && (order.buyerId || order.buyerEmail)) {
        const productIds = items.map((i) => i.productId).filter(Boolean);
        const buyerCondition = order.buyerId && order.buyerEmail
            ? or(eq(customerMeasurementsTable.userId, order.buyerId), eq(customerMeasurementsTable.customerEmail, order.buyerEmail))
            : (order.buyerId ? eq(customerMeasurementsTable.userId, order.buyerId) : eq(customerMeasurementsTable.customerEmail, order.buyerEmail!));

        if (productIds.length > 0) {
            measurements = await database
                .select()
                .from(customerMeasurementsTable)
                .where(and(buyerCondition, inArray(customerMeasurementsTable.productId, productIds)))
                .orderBy(desc(customerMeasurementsTable.createdAt))
                .limit(1);
        } else {
            measurements = await database
                .select()
                .from(customerMeasurementsTable)
                .where(buyerCondition)
                .orderBy(desc(customerMeasurementsTable.createdAt))
                .limit(1);
        }
    }

    // Fetch shipment and executive assignment if present
    const shipments = await database
        .select()
        .from(shipmentOrders)
        .where(eq(shipmentOrders.orderId, actualOrderId))
        .orderBy(desc(shipmentOrders.createdAt))
        .limit(1);

    let shipmentData: OrderShipmentDomain | null = null;
    if (shipments.length > 0) {
        const s = shipments[0];
        let executive: DeliveryExecutiveAssignment | null = null;
        if (s.notes) {
            try {
                const parsed: unknown = JSON.parse(s.notes);
                if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                    const fields = parsed as Record<string, unknown>;
                    const asString = (value: unknown): string | undefined =>
                        typeof value === "string" ? value : undefined;
                    executive = {
                        executiveName: asString(fields.executiveName),
                        executivePhone: asString(fields.executivePhone),
                        vehicleType: asString(fields.vehicleType),
                        courierPartner: asString(fields.courierPartner),
                        trackingNumber: asString(fields.trackingNumber),
                        status: asString(fields.status),
                        notes: asString(fields.notes),
                    };
                }
            } catch {
                executive = null;
            }
        }
        shipmentData = {
            id: s.id,
            shipmentNumber: s.shipmentNumber,
            awbNumber: s.awbNumber,
            trackingNumber: s.trackingNumber,
            status: s.status,
            shippingCost: s.shippingCost,
            notes: s.notes,
            executive,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
        };
    }

    return {
        order,
        items,
        addresses,
        history,
        payments,
        measurement: measurements[0] || null,
        shipment: shipmentData,
    };
};


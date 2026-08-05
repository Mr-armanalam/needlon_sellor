import { orders } from "@/db/schema/orders/table";
import { orderItems } from "@/db/schema/orders/order-items/table";
import { and, eq, ilike, isNull, or, sql, inArray } from "drizzle-orm";
import { GetFilteredOrdersRequestDto } from "../dto";
import { DbTransaction } from "@/db/transactions";
import { getDatabase } from "@/db/database";

interface FindFilteredOrdersParams {
    dto: GetFilteredOrdersRequestDto;
    sellerId: string;
    tx?: DbTransaction;
}

export const findFilteredOrders = async ({
    dto,
    sellerId,
    tx,
}: FindFilteredOrdersParams) => {
    const database = getDatabase(tx);
    const activeTab = (dto.status || "NEW").toUpperCase();
    const search = dto.search;
    const deliveryMode = dto.deliveryMode;
    const valueTier = dto.valueTier;
    const dateRange = dto.dateRange;

    const conditions: any[] = [];
    conditions.push(eq(orders.sellerId, sellerId));
    conditions.push(isNull(orders.deletedAt));

    // Status Tab Filtering
    if (activeTab === "NEW") {
        conditions.push(eq(orders.status, "PENDING"));
    } else if (activeTab === "ACCEPTED") {
        conditions.push(eq(orders.status, "CONFIRMED"));
    } else if (activeTab === "PACKED") {
        conditions.push(eq(orders.status, "PROCESSING"));
    } else if (activeTab === "READY") {
        conditions.push(eq(orders.status, "READY_TO_SHIP"));
    } else if (activeTab === "OUT_FOR_DELIVERY") {
        conditions.push(or(eq(orders.status, "SHIPPED"), eq(orders.status, "OUT_FOR_DELIVERY")));
    } else if (activeTab === "COMPLETED") {
        conditions.push(or(eq(orders.status, "DELIVERED"), eq(orders.status, "COMPLETED")));
    } else if (activeTab === "CANCELLED") {
        conditions.push(eq(orders.status, "CANCELLED"));
    } else if (activeTab === "RETURNED") {
        conditions.push(eq(orders.status, "RETURNED"));
    } else if (activeTab === "REJECTED") {
        conditions.push(eq(orders.status, "RETURN_REJECTED"));
    }

    if (search) {
        conditions.push(
            or(
                ilike(orders.orderNumber, `%${search}%`),
                ilike(orders.buyerName, `%${search}%`)
            )
        );
    }

    if (deliveryMode && deliveryMode !== "ALL") {
        conditions.push(eq(orders.shippingMethod, deliveryMode.toUpperCase() as any));
    }

    if (valueTier && valueTier !== "ALL") {
        if (valueTier === "LOW") {
            conditions.push(sql`${orders.grandTotal} < 1000`);
        } else if (valueTier === "MEDIUM") {
            conditions.push(sql`${orders.grandTotal} >= 1000 AND ${orders.grandTotal} <= 3000`);
        } else if (valueTier === "HIGH") {
            conditions.push(sql`${orders.grandTotal} > 3000`);
        }
    }

    if (dateRange && dateRange !== "ALL") {
        if (dateRange === "TODAY") {
            conditions.push(sql`${orders.createdAt} >= NOW() - INTERVAL '1 DAY'`);
        } else if (dateRange === "WEEK") {
            conditions.push(sql`${orders.createdAt} >= NOW() - INTERVAL '7 DAYS'`);
        } else if (dateRange === "MONTH") {
            conditions.push(sql`${orders.createdAt} >= NOW() - INTERVAL '30 DAYS'`);
        }
    }

    // Fetch order headers
    const fetchedOrders = await database
        .select()
        .from(orders)
        .where(and(...conditions))
        .orderBy(sql`${orders.createdAt} DESC`);

    // Load all the order items in a single query
    const orderIds = fetchedOrders.map(o => o.id);
    let orderLines: any[] = [];
    if (orderIds.length > 0) {
        orderLines = await database
            .select()
            .from(orderItems)
            .where(inArray(orderItems.orderId, orderIds));
    }

    // Group items by orderId
    const itemsByOrderId = new Map<string, any[]>();
    for (const line of orderLines) {
        if (!itemsByOrderId.has(line.orderId)) {
            itemsByOrderId.set(line.orderId, []);
        }
        itemsByOrderId.get(line.orderId)!.push(line);
    }

    const items = fetchedOrders.map(order => ({
        ...order,
        items: itemsByOrderId.get(order.id) || [],
    }));

    // Calculate tab counts
    const countRows = await database
        .select({
            status: orders.status,
            count: sql<number>`count(*)::int`,
        })
        .from(orders)
        .where(and(eq(orders.sellerId, sellerId), isNull(orders.deletedAt)))
        .groupBy(orders.status);

    const counts: Record<string, number> = {
        NEW: 0,
        ACCEPTED: 0,
        PACKED: 0,
        READY: 0,
        OUT_FOR_DELIVERY: 0,
        COMPLETED: 0,
        CANCELLED: 0,
        RETURNED: 0,
        REJECTED: 0,
    };

    for (const row of countRows) {
        const s = row.status;
        if (s === "PENDING") counts.NEW += row.count;
        else if (s === "CONFIRMED") counts.ACCEPTED += row.count;
        else if (s === "PROCESSING") counts.PACKED += row.count;
        else if (s === "READY_TO_SHIP") counts.READY += row.count;
        else if (s === "SHIPPED" || s === "OUT_FOR_DELIVERY") counts.OUT_FOR_DELIVERY += row.count;
        else if (s === "DELIVERED" || s === "COMPLETED") counts.COMPLETED += row.count;
        else if (s === "CANCELLED") counts.CANCELLED += row.count;
        else if (s === "RETURNED") counts.RETURNED += row.count;
        else if (s === "RETURN_REJECTED") counts.REJECTED += row.count;
    }

    return { items, counts };
};

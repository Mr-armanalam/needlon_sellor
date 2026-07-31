import { NextRequest, NextResponse } from "next/server";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { errorResponse } from "@/modules/shared/api/error-response";
import { db } from "@/db";
import { orders } from "@/db/schema/orders/table";
import { orderItems } from "@/db/schema/orders/order-items/table";
import { and, eq, ilike, isNull, or, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const seller = await getCurrentSeller();
    if (!seller || !seller.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Unauthorized: Only authenticated sellers can view orders.",
          },
        },
        { status: 401 }
      );
    }
    const sellerId = seller.id;

    const { searchParams } = new URL(req.url);
    const activeTab = (searchParams.get("status") || "NEW").toUpperCase();
    const search = searchParams.get("search");
    const deliveryMode = searchParams.get("deliveryMode");
    const valueTier = searchParams.get("valueTier");
    const dateRange = searchParams.get("dateRange");

    const conditions: any[] = [];
    conditions.push(eq(orders.sellerId, sellerId));
    conditions.push(isNull(orders.deletedAt));

    // Status Tab Filtering
    // UI tabs: New, Accepted, Packed, Ready, Out for Delivery, Completed, Cancelled, Returned, Rejected
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
    const fetchedOrders = await db
      .select()
      .from(orders)
      .where(and(...conditions))
      .orderBy(sql`${orders.createdAt} DESC`);

    // Load the order items for each fetched order
    const items = [];
    for (const order of fetchedOrders) {
      const orderLines = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));
      
      items.push({
        ...order,
        items: orderLines,
      });
    }

    // Calculate tab counts
    const countRows = await db
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

    return NextResponse.json({
      success: true,
      data: {
        items,
        counts,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

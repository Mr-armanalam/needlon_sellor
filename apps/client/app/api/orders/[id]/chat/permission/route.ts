import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@needlon/db";
import { orders } from "@needlon/db/db/schema/orders/table";
import { usersTable } from "@needlon/db/db/schema/users";
import { eq } from "drizzle-orm";
import { respondOrderChatRepo } from "@needlon/modules/orders/repositery/order-chat.repository";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUuid(id: string): boolean {
  return typeof id === "string" && UUID_REGEX.test(id);
}

async function resolveOrderId(idOrNumber: string): Promise<string | null> {
  if (isValidUuid(idOrNumber)) {
    return idOrNumber;
  }
  const [row] = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.orderNumber, idOrNumber))
    .limit(1);
  return row?.id || null;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderParam } = await params;
    const orderId = await resolveOrderId(orderParam);
    if (!orderId) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const session = await auth();
    let userId = session?.user?.id;
    if (!userId) {
      const [order] = await db
        .select({ buyerId: orders.buyerId })
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);
      userId = order?.buyerId;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action as "ACCEPT" | "DECLINE" | "BLOCK" | "UNBLOCK";

    if (!["ACCEPT", "DECLINE", "BLOCK", "UNBLOCK"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Supported actions: ACCEPT, DECLINE, BLOCK, UNBLOCK" },
        { status: 400 }
      );
    }

    const updated = await respondOrderChatRepo(userId, orderId, action);
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error: any) {
    console.error("CLIENT_ORDER_CHAT_PERMISSION_ERROR:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update chat permission" },
      { status: 400 }
    );
  }
}

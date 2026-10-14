import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@needlon/db";
import { orders } from "@needlon/db/db/schema/orders/table";
import { usersTable } from "@needlon/db/db/schema/users";
import { eq } from "drizzle-orm";
import {
  getOrderChatDetails,
  sendOrderChatMessageRepo,
} from "@needlon/modules/orders/repositery/order-chat.repository";

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

export async function GET(
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
      const [anyUser] = await db.select({ id: usersTable.id }).from(usersTable).limit(1);
      userId = anyUser?.id || undefined;
    }

    const chatDetails = await getOrderChatDetails(orderId, "BUYER", userId);
    return NextResponse.json({ success: true, data: chatDetails }, { status: 200 });
  } catch (error: any) {
    console.error("CLIENT_ORDER_CHAT_GET_ERROR:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load chat details" },
      { status: 500 }
    );
  }
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
      // Find order's buyerId
      const [order] = await db.select({ buyerId: orders.buyerId }).from(orders).where(eq(orders.id, orderId)).limit(1);
      userId = order?.buyerId;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const content = body.content;
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Message content cannot be empty" }, { status: 400 });
    }

    const message = await sendOrderChatMessageRepo(
      orderId,
      userId,
      "BUYER",
      content
    );

    return NextResponse.json({ success: true, data: message }, { status: 200 });
  } catch (error: any) {
    console.error("CLIENT_ORDER_CHAT_POST_ERROR:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to send message" },
      { status: 400 }
    );
  }
}

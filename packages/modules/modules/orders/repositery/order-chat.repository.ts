import { db } from "@needlon/db";
import { orders } from "@needlon/db/db/schema/orders/table";
import { chatPermissions } from "@needlon/db/db/schema/messaging/chat-permissions";
import { conversationsTable as conversations } from "@needlon/db/db/schema/messages/conversations/table";
import { messagesTable as messages } from "@needlon/db/db/schema/messages/messages/table";
import { usersTable } from "@needlon/db/db/schema/users";
import { seller } from "@needlon/db/db/schema/seller";
import { conversationMembersTable } from "@needlon/db/db/schema/messages/conversation-members/table";
import { eq, and, sql, or } from "drizzle-orm";

export interface OrderChatState {
  orderId: string;
  orderNumber: string;
  orderStatus: string;
  isDelivered: boolean;
  sellerId: string;
  sellerName?: string;
  buyerId: string;
  buyerName?: string;
  permission: {
    status: "NOT_REQUESTED" | "REQUESTED" | "ACCEPTED" | "DECLINED" | "BLOCKED";
    isEnabled: boolean;
    requestMessage: string | null;
    requestedAt?: Date | null;
    respondedAt?: Date | null;
    canMessage: boolean;
    lockReason?: "DELIVERED" | "BLOCKED" | "NOT_ACCEPTED" | "DISABLED" | null;
  };
  conversationId: string | null;
  messages: Array<{
    id: string;
    conversationId: string;
    senderType: (typeof messages.$inferSelect)["senderType"];
    senderId: string;
    content: string | null;
    sequenceNumber: number | null;
    createdAt: Date;
  }>;
}

export async function getOrderChatDetails(
  orderId: string,
  userRole: "BUYER" | "SELLER",
  userId?: string
): Promise<OrderChatState> {
  // 1. Locate the order
  const [order] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      sellerId: orders.sellerId,
      buyerId: orders.buyerId,
      status: orders.status,
    })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  const isDelivered = order.status === "DELIVERED" || order.status === "COMPLETED";

  // 2. Fetch buyer and seller display names
  let buyerName = "Customer";
  if (order.buyerId) {
    const [buyerRow] = await db
      .select({ name: usersTable.name, email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.id, order.buyerId))
      .limit(1);
    if (buyerRow?.name) buyerName = buyerRow.name;
    else if (buyerRow?.email) buyerName = buyerRow.email.split("@")[0];
  }

  let sellerName = "Atelier Tailor";
  if (order.sellerId) {
    const [sellerRow] = await db
      .select({ name: seller.name })
      .from(seller)
      .where(eq(seller.id, order.sellerId))
      .limit(1);
    if (sellerRow?.name) sellerName = sellerRow.name;
  }

  // 3. Locate chat permission for this order or seller-buyer pair
  const [perm] = await db
    .select()
    .from(chatPermissions)
    .where(
      and(
        eq(chatPermissions.sellerId, order.sellerId),
        eq(chatPermissions.buyerId, order.buyerId),
        or(eq(chatPermissions.orderId, order.id), sql`${chatPermissions.orderId} IS NULL`)
      )
    )
    .orderBy(sql`${chatPermissions.updatedAt} DESC`)
    .limit(1);

  // 4. Locate or create order conversation
  let [conv] = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.sellerId, order.sellerId),
        eq(conversations.buyerId, order.buyerId),
        eq(conversations.orderId, order.id)
      )
    )
    .limit(1);

  if (!conv) {
    const convValues: typeof conversations.$inferInsert = {
      type: "ORDER",
      sellerId: order.sellerId,
      buyerId: order.buyerId,
      orderId: order.id,
      participantCount: 2,
      title: `${buyerName} (Order #${order.orderNumber})`,
    };
    const [createdConv] = await db
      .insert(conversations)
      .values(convValues)
      .returning();
    conv = createdConv;
  }

  // Ensure seller membership is recorded in conversation_members
  if (conv?.id && order.sellerId) {
    try {
      await db
        .insert(conversationMembersTable)
        .values({
          conversationId: conv.id,
          sellerId: order.sellerId,
          role: "SELLER",
          status: "ACTIVE",
          unreadCount: 0,
        })
        .onConflictDoNothing();
    } catch {
      // Ignore conflict
    }
  }

  // 5. Fetch messages for conversation
  let messageRows: OrderChatState["messages"] = [];
  if (conv?.id) {
    messageRows = await db
      .select({
        id: messages.id,
        conversationId: messages.conversationId,
        senderType: messages.senderType,
        senderId: messages.senderId,
        content: sql<string>`COALESCE(${messages.content}, ${messages.text})`,
        sequenceNumber: messages.sequenceNumber,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(eq(messages.conversationId, conv.id))
      .orderBy(sql`${messages.sequenceNumber} ASC`)
      .limit(100);
  }

  // 6. Compute permission status and lock reason
  const rawStatus: OrderChatState["permission"]["status"] =
    (perm?.status as OrderChatState["permission"]["status"] | undefined) ?? "NOT_REQUESTED";
  const isEnabled = perm ? perm.isEnabled : true;

  let canMessage = false;
  let lockReason: "DELIVERED" | "BLOCKED" | "NOT_ACCEPTED" | "DISABLED" | null = null;

  if (isDelivered) {
    canMessage = false;
    lockReason = "DELIVERED";
  } else if (rawStatus === "BLOCKED") {
    canMessage = false;
    lockReason = "BLOCKED";
  } else if (!isEnabled) {
    canMessage = false;
    lockReason = "DISABLED";
  } else if (rawStatus === "ACCEPTED") {
    canMessage = true;
    lockReason = null;
  } else {
    canMessage = false;
    lockReason = "NOT_ACCEPTED";
  }

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    orderStatus: order.status,
    isDelivered,
    sellerId: order.sellerId,
    sellerName,
    buyerId: order.buyerId,
    buyerName,
    permission: {
      status: rawStatus,
      isEnabled,
      requestMessage: perm?.requestMessage || null,
      requestedAt: perm?.requestedAt || null,
      respondedAt: perm?.respondedAt || null,
      canMessage,
      lockReason,
    },
    conversationId: conv?.id || null,
    messages: messageRows,
  };
}

export async function requestOrderChatRepo(
  sellerId: string,
  orderId: string,
  message?: string
) {
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.sellerId, sellerId)))
    .limit(1);

  if (!order) {
    throw new Error("Order not found or unauthorized");
  }

  if (order.status === "DELIVERED" || order.status === "COMPLETED") {
    throw new Error("Cannot request chat on a delivered or completed order");
  }

  const defaultMsg =
    message?.trim() ||
    `Hello! We are preparing your order ${order.orderNumber} and would like to confirm your fitting and tailoring details.`;

  // Upsert chat permission
  const [upserted] = await db
    .insert(chatPermissions)
    .values({
      sellerId,
      buyerId: order.buyerId,
      orderId: order.id,
      status: "REQUESTED",
      isEnabled: true,
      requestMessage: defaultMsg,
      requestedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [chatPermissions.sellerId, chatPermissions.buyerId],
      set: {
        orderId: order.id,
        status: "REQUESTED",
        isEnabled: true,
        requestMessage: defaultMsg,
        requestedAt: new Date(),
        updatedAt: new Date(),
      },
    })
    .returning();

  return upserted;
}

export async function respondOrderChatRepo(
  buyerId: string,
  orderId: string,
  action: "ACCEPT" | "DECLINE" | "BLOCK" | "UNBLOCK"
) {
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.buyerId, buyerId)))
    .limit(1);

  if (!order) {
    throw new Error("Order not found or unauthorized");
  }

  let statusToSet: "ACCEPTED" | "DECLINED" | "BLOCKED" = "ACCEPTED";
  let isEnabledToSet = true;

  if (action === "DECLINE") {
    statusToSet = "DECLINED";
    isEnabledToSet = false;
  } else if (action === "BLOCK") {
    statusToSet = "BLOCKED";
    isEnabledToSet = false;
  } else if (action === "ACCEPT" || action === "UNBLOCK") {
    statusToSet = "ACCEPTED";
    isEnabledToSet = true;
  }

  const [updated] = await db
    .update(chatPermissions)
    .set({
      status: statusToSet,
      isEnabled: isEnabledToSet,
      respondedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(chatPermissions.buyerId, buyerId),
        eq(chatPermissions.sellerId, order.sellerId)
      )
    )
    .returning();

  return updated;
}

export async function sendOrderChatMessageRepo(
  orderId: string,
  senderId: string,
  senderType: "BUYER" | "SELLER",
  content: string
) {
  if (!content || !content.trim()) {
    throw new Error("Message content cannot be empty");
  }

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status === "DELIVERED" || order.status === "COMPLETED") {
    throw new Error("Chat is locked because this order is delivered");
  }

  // Verify permission
  const [perm] = await db
    .select()
    .from(chatPermissions)
    .where(
      and(
        eq(chatPermissions.sellerId, order.sellerId),
        eq(chatPermissions.buyerId, order.buyerId)
      )
    )
    .limit(1);

  if (!perm || perm.status !== "ACCEPTED" || !perm.isEnabled) {
    throw new Error("Chat is not active or has been blocked/disabled");
  }

  let buyerName = "Customer";
  if (order.buyerId) {
    const [buyerRow] = await db
      .select({ name: usersTable.name, email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.id, order.buyerId))
      .limit(1);
    if (buyerRow?.name) buyerName = buyerRow.name;
    else if (buyerRow?.email) buyerName = buyerRow.email.split("@")[0];
  }

  // Find or create conversation
  let [conv] = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.sellerId, order.sellerId),
        eq(conversations.buyerId, order.buyerId),
        eq(conversations.orderId, order.id)
      )
    )
    .limit(1);

  if (!conv) {
    const convValues: typeof conversations.$inferInsert = {
      type: "ORDER",
      sellerId: order.sellerId,
      buyerId: order.buyerId,
      orderId: order.id,
      participantCount: 2,
      title: `${buyerName} (Order #${order.orderNumber})`,
    };
    const [newConv] = await db
      .insert(conversations)
      .values(convValues)
      .returning();
    conv = newConv;
  }

  // Ensure seller membership is recorded in conversation_members
  if (conv?.id && order.sellerId) {
    try {
      await db
        .insert(conversationMembersTable)
        .values({
          conversationId: conv.id,
          sellerId: order.sellerId,
          role: "SELLER",
          status: "ACTIVE",
          unreadCount: 0,
        })
        .onConflictDoNothing();
    } catch {
      // Ignore
    }
  }

  // Get max sequence number
  const [maxSeqRow] = await db
    .select({ maxSeq: sql<number>`COALESCE(MAX(${messages.sequenceNumber}), 0)` })
    .from(messages)
    .where(eq(messages.conversationId, conv.id));

  const nextSeq = Number(maxSeqRow?.maxSeq || 0) + 1;

  const msgValues: typeof messages.$inferInsert = {
    conversationId: conv.id,
    senderType,
    senderId,
    type: "TEXT",
    text: content.trim(),
    content: content.trim(),
    status: "SENT",
    priority: "NORMAL",
    sequenceNumber: nextSeq,
    relatedOrderId: order.id,
  };
  const [createdMsg] = await db
    .insert(messages)
    .values(msgValues)
    .returning();

  // Update conversation lastMessageId, lastMessageAt, lastMessagePreview, unreadCount & updatedAt
  await db
    .update(conversations)
    .set({
      lastMessageId: createdMsg.id,
      lastMessageAt: new Date(),
      lastMessagePreview: content.trim().slice(0, 255),
      lastMessageType: "TEXT",
      updatedAt: new Date(),
      unreadCount: senderType === "BUYER" ? sql`COALESCE(${conversations.unreadCount}, 0) + 1` : conversations.unreadCount,
    })
    .where(eq(conversations.id, conv.id));

  // If buyer sent it, increment seller unread count in conversation_members
  if (senderType === "BUYER" && conv?.id && order.sellerId) {
    try {
      await db
        .update(conversationMembersTable)
        .set({
          unreadCount: sql`COALESCE(${conversationMembersTable.unreadCount}, 0) + 1`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(conversationMembersTable.conversationId, conv.id),
            eq(conversationMembersTable.sellerId, order.sellerId)
          )
        );
    } catch {
      // Ignore
    }
  }

  return createdMsg;
}

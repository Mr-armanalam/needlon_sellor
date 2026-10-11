"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { chatPermissions } from "@/db/schema/messaging/chat-permissions";
import { seller } from "@/db/schema/seller";
import { sellerStore } from "@/db/schema/seller/seller-store";
import { eq, and, sql } from "drizzle-orm";

export async function getCustomerChatPermissions() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false, data: [] };

  try {
    const list = await db
      .select({
        id: chatPermissions.id,
        sellerId: chatPermissions.sellerId,
        status: chatPermissions.status,
        isEnabled: chatPermissions.isEnabled,
        requestMessage: chatPermissions.requestMessage,
        requestedAt: chatPermissions.requestedAt,
        respondedAt: chatPermissions.respondedAt,
        sellerName: seller.name,
        storeName: sellerStore.storeName,
      })
      .from(chatPermissions)
      .leftJoin(seller, eq(chatPermissions.sellerId, seller.id))
      .leftJoin(sellerStore, eq(chatPermissions.sellerId, sellerStore.sellerId))
      .where(eq(chatPermissions.buyerId, userId))
      .orderBy(sql`${chatPermissions.requestedAt} DESC`);

    return {
      success: true,
      data: list.map((item) => ({
        ...item,
        requestedAt: item.requestedAt ? new Date(item.requestedAt).toISOString() : new Date().toISOString(),
        respondedAt: item.respondedAt ? new Date(item.respondedAt).toISOString() : null,
      })),
    };
  } catch (error) {
    console.error("Failed to load customer chat permissions:", error);
    return { success: false, data: [] };
  }
}

export async function respondChatPermissionAction(sellerId: string, status: "ACCEPTED" | "DECLINED") {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const [updated] = await db
    .update(chatPermissions)
    .set({
      status,
      isEnabled: status === "ACCEPTED",
      respondedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(chatPermissions.buyerId, userId),
        eq(chatPermissions.sellerId, sellerId)
      )
    )
    .returning();

  return { success: true, data: updated };
}

export async function toggleChatPrivacyAction(sellerId: string, isEnabled: boolean) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const [updated] = await db
    .update(chatPermissions)
    .set({
      isEnabled,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(chatPermissions.buyerId, userId),
        eq(chatPermissions.sellerId, sellerId)
      )
    )
    .returning();

  return { success: true, data: updated };
}

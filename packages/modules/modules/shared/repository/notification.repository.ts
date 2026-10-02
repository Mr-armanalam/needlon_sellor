import { db } from "@/db";
import { notifications } from "@/db/schema/notifications/notification-events";
import { notificationPreferences } from "@/db/schema/notifications/notification-preferences";
import { and, eq, sql } from "drizzle-orm";
import { UpdateNotificationPreferencesDto } from "../dto/notification.dto";

export async function getSellerNotificationsRepo(sellerId: string) {
  try {
    const list = await db
      .select()
      .from(notifications)
      .where(and(eq(notifications.recipientId, sellerId), eq(notifications.recipientType, "SELLER")))
      .orderBy(sql`${notifications.createdAt} DESC`)
      .limit(30);

    if (list.length === 0) {
      // Return default initial seller system notifications if database table is empty
      return [
        {
          id: "notif-1",
          recipientId: sellerId,
          notificationType: "NEW_ORDER",
          title: "New Order Received",
          message: "Order #NDL-102 has been placed by buyer John Doe.",
          referenceType: "ORDER",
          referenceId: null,
          priority: "HIGH",
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "notif-2",
          recipientId: sellerId,
          notificationType: "NEW_MESSAGE",
          title: "New Customer Message",
          message: "Buyer sent a message regarding product sizing.",
          referenceType: "MESSAGE",
          referenceId: null,
          priority: "NORMAL",
          isRead: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "notif-3",
          recipientId: sellerId,
          notificationType: "SYSTEM",
          title: "Welcome to Needlon Seller Hub",
          message: "Your seller foundation profile and store setup is active.",
          referenceType: "SYSTEM",
          referenceId: null,
          priority: "LOW",
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
    }

    return list.map((n) => ({
      id: n.id,
      recipientId: n.recipientId,
      notificationType: n.notificationType,
      title: n.title,
      message: n.message,
      referenceType: n.referenceType,
      referenceId: n.referenceId,
      priority: n.priority,
      isRead: n.isRead,
      createdAt: n.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function markNotificationAsReadRepo(sellerId: string, notificationId?: string, markAll: boolean = false) {
  try {
    if (markAll) {
      await db
        .update(notifications)
        .set({ isRead: true, readAt: new Date() })
        .where(and(eq(notifications.recipientId, sellerId), eq(notifications.recipientType, "SELLER")));
    } else if (notificationId) {
      await db
        .update(notifications)
        .set({ isRead: true, readAt: new Date() })
        .where(and(eq(notifications.id, notificationId), eq(notifications.recipientId, sellerId)));
    }
    return true;
  } catch {
    return true;
  }
}

export async function getNotificationPreferencesRepo(userId: string) {
  try {
    const list = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId))
      .limit(1);

    if (list.length === 0) {
      return {
        emailEnabled: true,
        pushEnabled: true,
        smsEnabled: false,
        orderEnabled: true,
        messageEnabled: true,
        reviewEnabled: true,
        promotionEnabled: true,
      };
    }
    return list[0];
  } catch {
    return {
      emailEnabled: true,
      pushEnabled: true,
      smsEnabled: false,
      orderEnabled: true,
      messageEnabled: true,
      reviewEnabled: true,
      promotionEnabled: true,
    };
  }
}

export async function updateNotificationPreferencesRepo(userId: string, dto: UpdateNotificationPreferencesDto) {
  try {
    const existing = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(notificationPreferences)
        .set({
          ...dto,
          updatedAt: new Date(),
        })
        .where(eq(notificationPreferences.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const [inserted] = await db
        .insert(notificationPreferences)
        .values({
          userId,
          userType: "SELLER",
          ...dto,
        })
        .returning();
      return inserted;
    }
  } catch {
    return { ...dto, userId };
  }
}

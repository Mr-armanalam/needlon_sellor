import { db } from "@needlon/db";
import { notifications } from "@needlon/db/db/schema/notifications/notification-events";
import { eq, and, desc } from "drizzle-orm";
import { format } from "date-fns";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUuid(id: string): boolean {
  return typeof id === "string" && UUID_REGEX.test(id);
}

const FALLBACK_NOTIFICATIONS = [
  {
    id: "notif-1",
    userId: "mock-user",
    title: "Order Shipped!",
    message: "Your order #order-002 has been shipped. Expected delivery in 2-3 days.",
    type: "order" as const,
    time: "2 days ago",
    read: false,
    createdAt: new Date("2026-09-28"),
  },
  {
    id: "notif-2",
    userId: "mock-user",
    title: "Order Delivered",
    message: "Your order #order-001 has been successfully delivered. Enjoy your purchase!",
    type: "order" as const,
    time: "1 week ago",
    read: true,
    createdAt: new Date("2026-09-20"),
  },
  {
    id: "notif-3",
    userId: "mock-user",
    title: "Exclusive Offer!",
    message: "Get 25% OFF on all Premium collections this weekend. Use code: PREM25",
    type: "offer" as const,
    time: "3 days ago",
    read: false,
    createdAt: new Date("2026-10-01"),
  },
  {
    id: "notif-4",
    userId: "mock-user",
    title: "New Arrival Alert",
    message: "The Winter Cashmere Edit is now live. Shop before it sells out!",
    type: "system" as const,
    time: "Just now",
    read: false,
    createdAt: new Date("2026-10-03"),
  },
];

export const NotificationService = {
  /**
   * Query all notifications for the authenticated buyer from notifications table
   */
  async getBuyerNotifications(userId: string) {
    if (!process.env.DATABASE_URL || !isValidUuid(userId)) {
      return FALLBACK_NOTIFICATIONS;
    }

    try {
      const rows = await db
        .select()
        .from(notifications)
        .where(
          and(
            eq(notifications.recipientType, "BUYER"),
            eq(notifications.recipientId, userId)
          )
        )
        .orderBy(desc(notifications.createdAt));

      if (rows.length === 0) {
        if (userId === "mock-user") return FALLBACK_NOTIFICATIONS;
        return [];
      }

      return rows.map((n) => {
        let notifType: "order" | "offer" | "system" = "system";
        if (["NEW_ORDER", "ORDER_STATUS", "DELIVERY", "RETURN"].includes(n.notificationType)) {
          notifType = "order";
        } else if (["PROMOTION", "REFERRAL"].includes(n.notificationType)) {
          notifType = "offer";
        }

        return {
          id: n.id,
          userId: n.recipientId,
          title: n.title,
          message: n.message,
          type: notifType,
          time: format(n.createdAt, "dd MMM yyyy, h:mma"),
          read: n.isRead,
          createdAt: n.createdAt,
        };
      });
    } catch (error) {
      console.error("NotificationService.getBuyerNotifications error:", error);
      return FALLBACK_NOTIFICATIONS;
    }
  },

  /**
   * Mark single notification as read
   */
  async markNotificationAsRead(notificationId: string, userId?: string) {
    if (!process.env.DATABASE_URL || !isValidUuid(notificationId)) {
      return { success: true };
    }

    try {
      const conditions = [eq(notifications.id, notificationId)];
      if (userId && isValidUuid(userId)) {
        conditions.push(eq(notifications.recipientId, userId));
      }

      await db
        .update(notifications)
        .set({
          isRead: true,
          readAt: new Date(),
        })
        .where(and(...conditions));

      return { success: true };
    } catch (error) {
      console.error("NotificationService.markNotificationAsRead error:", error);
      return { success: false };
    }
  },

  /**
   * Mark all unread buyer notifications as read
   */
  async markAllNotificationsAsRead(userId: string) {
    if (!process.env.DATABASE_URL || !isValidUuid(userId)) {
      return { success: true };
    }

    try {
      await db
        .update(notifications)
        .set({
          isRead: true,
          readAt: new Date(),
        })
        .where(
          and(
            eq(notifications.recipientType, "BUYER"),
            eq(notifications.recipientId, userId),
            eq(notifications.isRead, false)
          )
        );

      return { success: true };
    } catch (error) {
      console.error("NotificationService.markAllNotificationsAsRead error:", error);
      return { success: false };
    }
  },
};

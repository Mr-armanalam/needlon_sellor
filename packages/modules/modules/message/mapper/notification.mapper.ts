// ============================================================================
// Needlon
// Messages Module
// File: modules/message/mapper/notification.mapper.ts
// Description:
// Maps database notification entities into NotificationDto.
// ============================================================================

import { notificationsTable } from "@/db/schema/messages";
import { NotificationDto } from "../dto";

type NotificationDbRow = typeof notificationsTable.$inferSelect;

export function toNotificationDto(
    notification: NotificationDbRow,
): NotificationDto {
    return {
        id:
        notification.id,

        recipientSellerId:
        notification.recipientSellerId,

        type:
        notification.type,

        status:
        notification.status,

        priority:
        notification.priority,

        title:
        notification.title,

        body:
        notification.body,

        icon:
        notification.icon,

        imageUrl:
        notification.imageUrl,

        isRead:
        notification.isRead,

        readAt:
            notification.readAt?.toISOString() ??
            null,

        action:
            notification.actionUrl
                ? {
                    label: "View",
                    href: notification.actionUrl,
                }
                : null,

        metadata: {
            conversationId:
            notification.conversationId,

            messageId:
            notification.messageId,

            productId:
                (notification.metadata as any)?.productId ?? null,

            orderId:
                (notification.metadata as any)?.orderId ?? null,

            data:
                (notification.metadata as any)?.data ?? {},
        },

        createdAt:
            notification.createdAt.toISOString(),

        expiresAt:
            null,
    };
}
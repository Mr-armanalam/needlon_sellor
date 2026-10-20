// ============================================================================
// Needlon
// Messages Module
// File: modules/message/mapper/notification.mapper.ts
// Description:
// Maps database notification entities into NotificationDto.
// ============================================================================

import {
    NotificationMetadata,
    notificationsTable,
} from "@/db/schema/messages";
import { NotificationDto } from "../dto";

type NotificationDbRow = typeof notificationsTable.$inferSelect;

/**
 * Notification JSON metadata as read by this mapper: the stored
 * NotificationMetadata plus the shared product / order references
 * and the free-form payload this mapper forwards into the DTO.
 */
interface NotificationMetadataWithReferences
    extends NotificationMetadata {
    productId?: string | null;

    orderId?: string | null;

    data?: Record<string, unknown>;
}

export function toNotificationDto(
    notification: NotificationDbRow,
): NotificationDto {
    const metadata =
        notification.metadata as NotificationMetadataWithReferences;

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
                metadata?.productId ?? null,

            orderId:
                metadata?.orderId ?? null,

            data:
                metadata?.data ?? {},
        },

        createdAt:
            notification.createdAt.toISOString(),

        expiresAt:
            null,
    };
}
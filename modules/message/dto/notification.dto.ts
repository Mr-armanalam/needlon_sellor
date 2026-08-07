// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/dto/notification.dto.ts
// Description:
// DTO representing an in-app notification returned by the Messages API.
// ============================================================================

import {
    MessageNotificationPriority,
    MessageNotificationStatus,
    MessageNotificationType,
} from "@/db/schema/messages";

/**
 * ============================================================================
 * Notification Action DTO
 * ============================================================================
 */

export interface NotificationActionDto {
    /**
     * Action label displayed
     * in the notification.
     */
    label: string;

    /**
     * Navigation URL.
     */
    href: string;
}

/**
 * ============================================================================
 * Notification Metadata DTO
 * ============================================================================
 */

export interface NotificationMetadataDto {
    /**
     * Conversation related
     * to this notification.
     */
    conversationId: string | null;

    /**
     * Message related
     * to this notification.
     */
    messageId: string | null;

    /**
     * Shared product.
     */
    productId: string | null;

    /**
     * Shared order.
     */
    orderId: string | null;

    /**
     * Additional metadata.
     */
    data: Record<string, unknown>;
}

/**
 * ============================================================================
 * Notification DTO
 * ============================================================================
 */

export interface NotificationDto {
    /**
     * Notification identifier.
     */
    id: string;

    /**
     * Recipient seller.
     */
    recipientSellerId: string;

    /**
     * Notification type.
     */
    type: MessageNotificationType;

    /**
     * Current status.
     */
    status: MessageNotificationStatus;

    /**
     * Priority.
     */
    priority: MessageNotificationPriority;

    /**
     * Notification title.
     */
    title: string;

    /**
     * Notification body.
     */
    body: string;

    /**
     * Optional icon.
     */
    icon: string | null;

    /**
     * Optional image.
     */
    imageUrl: string | null;

    /**
     * Whether read.
     */
    isRead: boolean;

    /**
     * Read timestamp.
     */
    readAt: string | null;

    /**
     * Optional CTA.
     */
    action: NotificationActionDto | null;

    /**
     * Related metadata.
     */
    metadata: NotificationMetadataDto;

    /**
     * Creation timestamp.
     */
    createdAt: string;

    /**
     * Expiration timestamp.
     */
    expiresAt: string | null;
}
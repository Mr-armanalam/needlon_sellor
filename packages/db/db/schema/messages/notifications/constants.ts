// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/notifications/constants.ts
// Description:
// Shared constants for Conversation Notifications.
// ============================================================================

/**
 * ============================================================================
 * Notification Types
 * ============================================================================
 *
 * Represents the reason a notification was generated.
 */

export const MESSAGE_NOTIFICATION_TYPES = [
    "MESSAGE",
    "IMAGE",
    "VIDEO",
    "AUDIO",
    "FILE",
    "PRODUCT_SHARED",
    "ORDER_SHARED",
    "REACTION",
    "MENTION",
    "SYSTEM",
] as const;

/**
 * ============================================================================
 * Notification Status
 * ============================================================================
 */

export const MESSAGE_NOTIFICATION_STATUSES = [
    "UNREAD",
    "READ",
    "ARCHIVED",
    "DELETED",
] as const;

/**
 * ============================================================================
 * Delivery Status
 * ============================================================================
 */

export const MESSAGE_NOTIFICATION_DELIVERY_STATUSES =
    [
        "PENDING",
        "DELIVERED",
        "FAILED",
    ] as const;

/**
 * ============================================================================
 * Notification Priority
 * ============================================================================
 */

export const MESSAGE_NOTIFICATION_PRIORITIES =
    [
        "LOW",
        "NORMAL",
        "HIGH",
        "URGENT",
    ] as const;

/**
 * ============================================================================
 * Notification Source
 * ============================================================================
 */

export const MESSAGE_NOTIFICATION_SOURCES =
    [
        "USER",
        "SYSTEM",
        "SELLER",
        "BUYER",
        "ADMIN",
    ] as const;

/**
 * ============================================================================
 * Database Limits
 * ============================================================================
 */

export const MESSAGE_NOTIFICATION_TITLE_MAX_LENGTH =
    200;

export const MESSAGE_NOTIFICATION_BODY_MAX_LENGTH =
    1000;

export const MESSAGE_NOTIFICATION_IMAGE_URL_MAX_LENGTH =
    2048;

export const MESSAGE_NOTIFICATION_ACTION_URL_MAX_LENGTH =
    2048;

export const MESSAGE_NOTIFICATION_ICON_MAX_LENGTH =
    100;
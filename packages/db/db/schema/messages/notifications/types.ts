// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/notifications/types.ts
// Description:
// Shared TypeScript types derived from Notification constants.
// ============================================================================

import {
    MESSAGE_NOTIFICATION_ACTION_URL_MAX_LENGTH,
    MESSAGE_NOTIFICATION_BODY_MAX_LENGTH,
    MESSAGE_NOTIFICATION_DELIVERY_STATUSES,
    MESSAGE_NOTIFICATION_ICON_MAX_LENGTH,
    MESSAGE_NOTIFICATION_IMAGE_URL_MAX_LENGTH,
    MESSAGE_NOTIFICATION_PRIORITIES,
    MESSAGE_NOTIFICATION_SOURCES,
    MESSAGE_NOTIFICATION_STATUSES,
    MESSAGE_NOTIFICATION_TITLE_MAX_LENGTH,
    MESSAGE_NOTIFICATION_TYPES,
} from "./constants";

/**
 * ============================================================================
 * Notification Types
 * ============================================================================
 */

export type MessageNotificationType =
    (typeof MESSAGE_NOTIFICATION_TYPES)[number];

export type MessageNotificationStatus =
    (typeof MESSAGE_NOTIFICATION_STATUSES)[number];

export type MessageNotificationDeliveryStatus =
    (typeof MESSAGE_NOTIFICATION_DELIVERY_STATUSES)[number];

export type MessageNotificationPriority =
    (typeof MESSAGE_NOTIFICATION_PRIORITIES)[number];

export type MessageNotificationSource =
    (typeof MESSAGE_NOTIFICATION_SOURCES)[number];

/**
 * ============================================================================
 * Constant Maps
 * ============================================================================
 */

export const MessageNotificationType =
    MESSAGE_NOTIFICATION_TYPES.reduce(
        (acc, value) => {
            acc[value] = value;

            return acc;
        },
        {} as Record<
            MessageNotificationType,
            MessageNotificationType
        >,
    );

export const MessageNotificationStatus =
    MESSAGE_NOTIFICATION_STATUSES.reduce(
        (acc, value) => {
            acc[value] = value;

            return acc;
        },
        {} as Record<
            MessageNotificationStatus,
            MessageNotificationStatus
        >,
    );

export const MessageNotificationDeliveryStatus =
    MESSAGE_NOTIFICATION_DELIVERY_STATUSES.reduce(
        (acc, value) => {
            acc[value] = value;

            return acc;
        },
        {} as Record<
            MessageNotificationDeliveryStatus,
            MessageNotificationDeliveryStatus
        >,
    );

export const MessageNotificationPriority =
    MESSAGE_NOTIFICATION_PRIORITIES.reduce(
        (acc, value) => {
            acc[value] = value;

            return acc;
        },
        {} as Record<
            MessageNotificationPriority,
            MessageNotificationPriority
        >,
    );

export const MessageNotificationSource =
    MESSAGE_NOTIFICATION_SOURCES.reduce(
        (acc, value) => {
            acc[value] = value;

            return acc;
        },
        {} as Record<
            MessageNotificationSource,
            MessageNotificationSource
        >,
    );

/**
 * ============================================================================
 * Constraints
 * ============================================================================
 */

export interface MessageNotificationConstraints {
    readonly maxTitleLength: typeof MESSAGE_NOTIFICATION_TITLE_MAX_LENGTH;

    readonly maxBodyLength: typeof MESSAGE_NOTIFICATION_BODY_MAX_LENGTH;

    readonly maxImageUrlLength: typeof MESSAGE_NOTIFICATION_IMAGE_URL_MAX_LENGTH;

    readonly maxActionUrlLength: typeof MESSAGE_NOTIFICATION_ACTION_URL_MAX_LENGTH;

    readonly maxIconLength: typeof MESSAGE_NOTIFICATION_ICON_MAX_LENGTH;
}

export const MessageNotificationConstraints: MessageNotificationConstraints =
    Object.freeze({
        maxTitleLength:
        MESSAGE_NOTIFICATION_TITLE_MAX_LENGTH,

        maxBodyLength:
        MESSAGE_NOTIFICATION_BODY_MAX_LENGTH,

        maxImageUrlLength:
        MESSAGE_NOTIFICATION_IMAGE_URL_MAX_LENGTH,

        maxActionUrlLength:
        MESSAGE_NOTIFICATION_ACTION_URL_MAX_LENGTH,

        maxIconLength:
        MESSAGE_NOTIFICATION_ICON_MAX_LENGTH,
    });
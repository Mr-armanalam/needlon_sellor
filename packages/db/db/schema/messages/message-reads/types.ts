// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/message-reads/types.ts
// Description:
// Shared TypeScript types derived from Message Read constants.
// ============================================================================

import {
    MESSAGE_READ_SOURCES,
    MESSAGE_READ_STATUSES,
    MESSAGE_READ_SYNC_STATUSES,
    MESSAGE_READ_DEVICE_ID_MAX_LENGTH,
    MESSAGE_READ_SESSION_ID_MAX_LENGTH,
    MESSAGE_READ_IP_ADDRESS_MAX_LENGTH,
    MESSAGE_READ_USER_AGENT_MAX_LENGTH,
} from "./constants";

/**
 * ============================================================================
 * Message Read
 * ============================================================================
 */

export type MessageReadStatus =
    (typeof MESSAGE_READ_STATUSES)[number];

export type MessageReadSource =
    (typeof MESSAGE_READ_SOURCES)[number];

export type MessageReadSyncStatus =
    (typeof MESSAGE_READ_SYNC_STATUSES)[number];

/**
 * ============================================================================
 * Constant Maps
 * ============================================================================
 */

export const MessageReadStatus =
    MESSAGE_READ_STATUSES.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            MessageReadStatus,
            MessageReadStatus
        >,
    );

export const MessageReadSource =
    MESSAGE_READ_SOURCES.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            MessageReadSource,
            MessageReadSource
        >,
    );

export const MessageReadSyncStatus =
    MESSAGE_READ_SYNC_STATUSES.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            MessageReadSyncStatus,
            MessageReadSyncStatus
        >,
    );

/**
 * ============================================================================
 * Constraints
 * ============================================================================
 */

export interface MessageReadConstraints {
    readonly maxDeviceIdLength: typeof MESSAGE_READ_DEVICE_ID_MAX_LENGTH;

    readonly maxSessionIdLength: typeof MESSAGE_READ_SESSION_ID_MAX_LENGTH;

    readonly maxIpAddressLength: typeof MESSAGE_READ_IP_ADDRESS_MAX_LENGTH;

    readonly maxUserAgentLength: typeof MESSAGE_READ_USER_AGENT_MAX_LENGTH;
}

export const MessageReadConstraints: MessageReadConstraints =
    Object.freeze({
        maxDeviceIdLength:
        MESSAGE_READ_DEVICE_ID_MAX_LENGTH,

        maxSessionIdLength:
        MESSAGE_READ_SESSION_ID_MAX_LENGTH,

        maxIpAddressLength:
        MESSAGE_READ_IP_ADDRESS_MAX_LENGTH,

        maxUserAgentLength:
        MESSAGE_READ_USER_AGENT_MAX_LENGTH,
    });
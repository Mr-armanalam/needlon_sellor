// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/message-reactions/types.ts
// Description:
// Shared TypeScript types derived from Message Reaction constants.
// ============================================================================

import {
    MESSAGE_REACTIONS,
    MESSAGE_REACTION_SOURCES,
    MESSAGE_REACTION_SYNC_STATUSES,
    MESSAGE_REACTION_DEVICE_ID_MAX_LENGTH,
    MESSAGE_REACTION_SESSION_ID_MAX_LENGTH,
    MESSAGE_REACTION_IP_ADDRESS_MAX_LENGTH,
    MESSAGE_REACTION_USER_AGENT_MAX_LENGTH,
} from "./constants";

/**
 * ============================================================================
 * Message Reaction
 * ============================================================================
 */

export type MessageReaction =
    (typeof MESSAGE_REACTIONS)[number];

export type MessageReactionSource =
    (typeof MESSAGE_REACTION_SOURCES)[number];

export type MessageReactionSyncStatus =
    (typeof MESSAGE_REACTION_SYNC_STATUSES)[number];

/**
 * ============================================================================
 * Constant Maps
 * ============================================================================
 */

export const MessageReaction =
    MESSAGE_REACTIONS.reduce(
        (acc, value) => {
            acc[value] = value;

            return acc;
        },
        {} as Record<
            MessageReaction,
            MessageReaction
        >,
    );

export const MessageReactionSource =
    MESSAGE_REACTION_SOURCES.reduce(
        (acc, value) => {
            acc[value] = value;

            return acc;
        },
        {} as Record<
            MessageReactionSource,
            MessageReactionSource
        >,
    );

export const MessageReactionSyncStatus =
    MESSAGE_REACTION_SYNC_STATUSES.reduce(
        (acc, value) => {
            acc[value] = value;

            return acc;
        },
        {} as Record<
            MessageReactionSyncStatus,
            MessageReactionSyncStatus
        >,
    );

/**
 * ============================================================================
 * Constraints
 * ============================================================================
 */

export interface MessageReactionConstraints {
    readonly maxDeviceIdLength: typeof MESSAGE_REACTION_DEVICE_ID_MAX_LENGTH;

    readonly maxSessionIdLength: typeof MESSAGE_REACTION_SESSION_ID_MAX_LENGTH;

    readonly maxIpAddressLength: typeof MESSAGE_REACTION_IP_ADDRESS_MAX_LENGTH;

    readonly maxUserAgentLength: typeof MESSAGE_REACTION_USER_AGENT_MAX_LENGTH;
}

export const MessageReactionConstraints: MessageReactionConstraints =
    Object.freeze({
        maxDeviceIdLength:
        MESSAGE_REACTION_DEVICE_ID_MAX_LENGTH,

        maxSessionIdLength:
        MESSAGE_REACTION_SESSION_ID_MAX_LENGTH,

        maxIpAddressLength:
        MESSAGE_REACTION_IP_ADDRESS_MAX_LENGTH,

        maxUserAgentLength:
        MESSAGE_REACTION_USER_AGENT_MAX_LENGTH,
    });
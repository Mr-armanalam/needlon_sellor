// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/conversations/types.ts
// Description:
// Shared TypeScript types derived from conversation constants.
// ============================================================================

import {
    CONVERSATION_STATUSES,
    CONVERSATION_TYPES,
    LAST_MESSAGE_TYPES,
} from "./constants";

/**
 * ============================================================================
 * Conversation
 * ============================================================================
 */

export type ConversationType =
    (typeof CONVERSATION_TYPES)[number];

export type ConversationStatus =
    (typeof CONVERSATION_STATUSES)[number];

export type LastMessageType =
    (typeof LAST_MESSAGE_TYPES)[number];

/**
 * ============================================================================
 * Constant Maps
 * ============================================================================
 *
 * These maps provide strongly typed values throughout the application,
 * following the Needlon schema convention.
 */

export const ConversationType = CONVERSATION_TYPES.reduce(
    (acc, value) => {
        acc[value] = value;
        return acc;
    },
    {} as Record<ConversationType, ConversationType>,
);

export const ConversationStatus =
    CONVERSATION_STATUSES.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            ConversationStatus,
            ConversationStatus
        >,
    );

export const LastMessageType =
    LAST_MESSAGE_TYPES.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            LastMessageType,
            LastMessageType
        >,
    );
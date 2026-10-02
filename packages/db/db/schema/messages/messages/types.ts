// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/messages/types.ts
// Description:
// Shared TypeScript types derived from Message constants.
// ============================================================================

import {
    MESSAGE_EDIT_STATUSES,
    MESSAGE_PRIORITIES,
    MESSAGE_SENDER_TYPES,
    MESSAGE_STATUSES,
    MESSAGE_TYPES,
} from "./constants";

/**
 * ============================================================================
 * Message
 * ============================================================================
 */

export type MessageType =
    (typeof MESSAGE_TYPES)[number];

export type MessageStatus =
    (typeof MESSAGE_STATUSES)[number];

export type MessageSenderType =
    (typeof MESSAGE_SENDER_TYPES)[number];

export type MessageEditStatus =
    (typeof MESSAGE_EDIT_STATUSES)[number];

export type MessagePriority =
    (typeof MESSAGE_PRIORITIES)[number];

/**
 * ============================================================================
 * Constant Maps
 * ============================================================================
 *
 * Provides strongly typed values throughout the application,
 * following the Needlon schema convention.
 */

export const MessageType = MESSAGE_TYPES.reduce(
    (acc, value) => {
        acc[value] = value;
        return acc;
    },
    {} as Record<MessageType, MessageType>,
);

export const MessageStatus =
    MESSAGE_STATUSES.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            MessageStatus,
            MessageStatus
        >,
    );

export const MessageSenderType =
    MESSAGE_SENDER_TYPES.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            MessageSenderType,
            MessageSenderType
        >,
    );

export const MessageEditStatus =
    MESSAGE_EDIT_STATUSES.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            MessageEditStatus,
            MessageEditStatus
        >,
    );

export const MessagePriority =
    MESSAGE_PRIORITIES.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            MessagePriority,
            MessagePriority
        >,
    );
// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/conversation-members/types.ts
// Description:
// Shared TypeScript types derived from Conversation Member constants.
// ============================================================================

import {
    CONVERSATION_MEMBER_ROLES,
    CONVERSATION_MEMBER_STATUSES,
    CONVERSATION_NOTIFICATION_PREFERENCES,
} from "./constants";

/**
 * ============================================================================
 * Conversation Member
 * ============================================================================
 */

export type ConversationMemberRole =
    (typeof CONVERSATION_MEMBER_ROLES)[number];

export type ConversationMemberStatus =
    (typeof CONVERSATION_MEMBER_STATUSES)[number];

export type ConversationNotificationPreference =
    (typeof CONVERSATION_NOTIFICATION_PREFERENCES)[number];

/**
 * ============================================================================
 * Constant Maps
 * ============================================================================
 *
 * Provides strongly typed values throughout the application,
 * following the Needlon schema convention.
 */

export const ConversationMemberRole =
    CONVERSATION_MEMBER_ROLES.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            ConversationMemberRole,
            ConversationMemberRole
        >,
    );

export const ConversationMemberStatus =
    CONVERSATION_MEMBER_STATUSES.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            ConversationMemberStatus,
            ConversationMemberStatus
        >,
    );

export const ConversationNotificationPreference =
    CONVERSATION_NOTIFICATION_PREFERENCES.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            ConversationNotificationPreference,
            ConversationNotificationPreference
        >,
    );
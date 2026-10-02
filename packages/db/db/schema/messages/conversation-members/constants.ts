// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/conversation-members/constants.ts
// Description:
// Shared constants for the Conversation Members schema.
// ============================================================================

/**
 * ============================================================================
 * Conversation Member Roles
 * ============================================================================
 *
 * Defines the business role of a participant inside a conversation.
 */

export const CONVERSATION_MEMBER_ROLES = [
    "SELLER",
    "BUYER",
    "ADMIN",
    "SUPPORT",
    "SYSTEM",
] as const;

/**
 * ============================================================================
 * Conversation Member Status
 * ============================================================================
 */

export const CONVERSATION_MEMBER_STATUSES = [
    "ACTIVE",
    "LEFT",
    "REMOVED",
    "BLOCKED",
] as const;

/**
 * ============================================================================
 * Notification Preference
 * ============================================================================
 */

export const CONVERSATION_NOTIFICATION_PREFERENCES = [
    "ALL_MESSAGES",
    "MENTIONS_ONLY",
    "MUTED",
] as const;

/**
 * ============================================================================
 * Member Limits
 * ============================================================================
 */

export const CONVERSATION_NICKNAME_MAX_LENGTH = 150;

export const CONVERSATION_MEMBER_SEARCH_LIMIT = 20;
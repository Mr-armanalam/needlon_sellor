// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/conversations/constants.ts
// Description:
// Shared constants for the Conversations schema.
// ============================================================================

/**
 * ============================================================================
 * Conversation Types
 * ============================================================================
 *
 * Defines the business context of a conversation.
 */

export const CONVERSATION_TYPES = [
    "DIRECT",
    "ORDER",
    "PRODUCT",
    "SUPPORT",
] as const;

/**
 * ============================================================================
 * Conversation Status
 * ============================================================================
 */

export const CONVERSATION_STATUSES = [
    "ACTIVE",
    "ARCHIVED",
    "BLOCKED",
    "CLOSED",
] as const;

/**
 * ============================================================================
 * Last Message Types
 * ============================================================================
 */

export const LAST_MESSAGE_TYPES = [
    "TEXT",
    "IMAGE",
    "VIDEO",
    "AUDIO",
    "DOCUMENT",
    "PRODUCT",
    "ORDER",
    "SYSTEM",
] as const;

/**
 * ============================================================================
 * Database Limits
 * ============================================================================
 */

export const LAST_MESSAGE_PREVIEW_MAX_LENGTH = 500;

export const CONVERSATION_TITLE_MAX_LENGTH = 200;

/**
 * ============================================================================
 * Search
 * ============================================================================
 */

export const CONVERSATION_SEARCH_RESULT_LIMIT = 20;

export const CONVERSATION_LIST_PAGE_SIZE = 25;
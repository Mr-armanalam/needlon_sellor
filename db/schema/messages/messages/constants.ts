// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/messages/constants.ts
// Description:
// Shared constants for the Messages schema.
// ============================================================================

/**
 * ============================================================================
 * Message Types
 * ============================================================================
 *
 * Defines the content carried by a message.
 */

export const MESSAGE_TYPES = [
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
 * Message Status
 * ============================================================================
 *
 * Lifecycle of an individual message.
 */

export const MESSAGE_STATUSES = [
    "SENDING",
    "SENT",
    "DELIVERED",
    "READ",
    "FAILED",
    "DELETED",
] as const;

/**
 * ============================================================================
 * Message Sender Types
 * ============================================================================
 */

export const MESSAGE_SENDER_TYPES = [
    "SELLER",
    "BUYER",
    "ADMIN",
    "SUPPORT",
    "SYSTEM",
    "AI",
] as const;

/**
 * ============================================================================
 * Message Edit Status
 * ============================================================================
 */

export const MESSAGE_EDIT_STATUSES = [
    "ORIGINAL",
    "EDITED",
] as const;

/**
 * ============================================================================
 * Message Priority
 * ============================================================================
 */

export const MESSAGE_PRIORITIES = [
    "LOW",
    "NORMAL",
    "HIGH",
    "URGENT",
] as const;

/**
 * ============================================================================
 * Database Limits
 * ============================================================================
 */

export const MESSAGE_TEXT_MAX_LENGTH =
    10000;

export const MESSAGE_CAPTION_MAX_LENGTH =
    2000;

export const MESSAGE_SEARCH_RESULT_LIMIT =
    50;

export const MESSAGE_PAGE_SIZE = 50;
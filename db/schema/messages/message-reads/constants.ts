// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/message-reads/constants.ts
// Description:
// Shared constants for the Message Reads schema.
// ============================================================================

/**
 * ============================================================================
 * Read Status
 * ============================================================================
 *
 * Represents the lifecycle of a message read receipt.
 */

export const MESSAGE_READ_STATUSES = [
    "DELIVERED",
    "READ",
] as const;

/**
 * ============================================================================
 * Read Sources
 * ============================================================================
 *
 * Indicates where the read event originated.
 */

export const MESSAGE_READ_SOURCES = [
    "WEB",
    "ANDROID",
    "IOS",
    "DESKTOP",
    "SYSTEM",
] as const;

/**
 * ============================================================================
 * Read Sync Status
 * ============================================================================
 *
 * Used when synchronizing read receipts
 * across multiple devices.
 */

export const MESSAGE_READ_SYNC_STATUSES = [
    "PENDING",
    "SYNCED",
    "FAILED",
] as const;

/**
 * ============================================================================
 * Database Limits
 * ============================================================================
 */

export const MESSAGE_READ_DEVICE_ID_MAX_LENGTH =
    150;

export const MESSAGE_READ_SESSION_ID_MAX_LENGTH =
    150;

export const MESSAGE_READ_IP_ADDRESS_MAX_LENGTH =
    45;

export const MESSAGE_READ_USER_AGENT_MAX_LENGTH =
    512;
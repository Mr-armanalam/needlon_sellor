// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/message-reactions/constants.ts
// Description:
// Shared constants for the Message Reactions schema.
// ============================================================================

/**
 * ============================================================================
 * Supported Message Reactions
 * ============================================================================
 *
 * These are the only reactions currently supported
 * throughout the messaging platform.
 */

export const MESSAGE_REACTIONS = [
    "LIKE",
    "LOVE",
    "LAUGH",
    "WOW",
    "SAD",
    "ANGRY",
    "THUMBS_UP",
    "THUMBS_DOWN",
    "FIRE",
    "HEART",
    "PARTY",
    "CLAP",
] as const;

/**
 * ============================================================================
 * Reaction Sources
 * ============================================================================
 *
 * Indicates which client created
 * the reaction.
 */

export const MESSAGE_REACTION_SOURCES = [
    "WEB",
    "ANDROID",
    "IOS",
    "DESKTOP",
    "SYSTEM",
] as const;

/**
 * ============================================================================
 * Synchronization Status
 * ============================================================================
 *
 * Used for multi-device synchronization.
 */

export const MESSAGE_REACTION_SYNC_STATUSES = [
    "PENDING",
    "SYNCED",
    "FAILED",
] as const;

/**
 * ============================================================================
 * Limits
 * ============================================================================
 */

export const MESSAGE_REACTION_DEVICE_ID_MAX_LENGTH =
    150;

export const MESSAGE_REACTION_SESSION_ID_MAX_LENGTH =
    150;

export const MESSAGE_REACTION_USER_AGENT_MAX_LENGTH =
    512;

export const MESSAGE_REACTION_IP_ADDRESS_MAX_LENGTH =
    45;
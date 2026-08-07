// ============================================================================
// Needlon
// Messages Module
// File: modules/messages/constants.ts
// Description:
// Shared constants used across the Messages module.
// ============================================================================

/**
 * ============================================================================
 * Module
 * ============================================================================
 */

export const MESSAGES_MODULE_NAME =
    "messages";

/**
 * ============================================================================
 * Pagination
 * ============================================================================
 */

export const DEFAULT_CONVERSATION_LIMIT =
    20;

export const MAX_CONVERSATION_LIMIT =
    100;

export const DEFAULT_MESSAGE_LIMIT =
    30;

export const MAX_MESSAGE_LIMIT =
    100;

export const DEFAULT_NOTIFICATION_LIMIT =
    20;

export const MAX_NOTIFICATION_LIMIT =
    100;

/**
 * ============================================================================
 * Message Constraints
 * ============================================================================
 */

export const MESSAGE_MIN_LENGTH =
    1;

export const MESSAGE_MAX_LENGTH =
    5000;

export const MESSAGE_EDIT_TIME_LIMIT_MS =
    15 * 60 * 1000; // 15 minutes

export const MESSAGE_RECALL_TIME_LIMIT_MS =
    15 * 60 * 1000; // 15 minutes

/**
 * ============================================================================
 * Conversation Constraints
 * ============================================================================
 */

export const MIN_GROUP_MEMBERS =
    2;

export const MAX_GROUP_MEMBERS =
    500;

export const MAX_GROUP_NAME_LENGTH =
    150;

export const MAX_GROUP_DESCRIPTION_LENGTH =
    1000;

/**
 * ============================================================================
 * Attachment Constraints
 * ============================================================================
 */

export const MAX_ATTACHMENTS_PER_MESSAGE =
    10;

export const MAX_ATTACHMENT_SIZE =
    100 * 1024 * 1024; // 100 MB

/**
 * ============================================================================
 * Product / Order Sharing
 * ============================================================================
 */

export const MAX_SHARED_PRODUCTS_PER_MESSAGE =
    10;

export const MAX_SHARED_ORDERS_PER_MESSAGE =
    1;

/**
 * ============================================================================
 * Reactions
 * ============================================================================
 */

export const MAX_REACTIONS_PER_MESSAGE =
    1000;

/**
 * ============================================================================
 * Notifications
 * ============================================================================
 */

export const NOTIFICATION_BATCH_SIZE =
    100;

export const NOTIFICATION_RETRY_LIMIT =
    5;

/**
 * ============================================================================
 * Cache
 * ============================================================================
 */

export const CONVERSATION_CACHE_TTL_SECONDS =
    60;

export const MESSAGE_CACHE_TTL_SECONDS =
    30;

export const NOTIFICATION_CACHE_TTL_SECONDS =
    60;

/**
 * ============================================================================
 * Realtime
 * ============================================================================
 */

export const TYPING_INDICATOR_TIMEOUT_MS =
    5000;

export const PRESENCE_HEARTBEAT_INTERVAL_MS =
    30000;

export const MESSAGE_DELIVERY_TIMEOUT_MS =
    10000;

/**
 * ============================================================================
 * Upload Buckets
 * ============================================================================
 */

export const MESSAGE_ATTACHMENT_BUCKET =
    "message-attachments";

export const MESSAGE_IMAGE_FOLDER =
    "images";

export const MESSAGE_VIDEO_FOLDER =
    "videos";

export const MESSAGE_AUDIO_FOLDER =
    "audio";

export const MESSAGE_FILE_FOLDER =
    "files";
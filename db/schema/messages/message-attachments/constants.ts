// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/message-attachments/constants.ts
// Description:
// Shared constants for the Message Attachments schema.
// ============================================================================

/**
 * ============================================================================
 * Attachment Types
 * ============================================================================
 *
 * Defines the business type of an attachment associated with a message.
 */

export const MESSAGE_ATTACHMENT_TYPES = [
    "IMAGE",
    "VIDEO",
    "AUDIO",
    "DOCUMENT",
    "PDF",
    "SPREADSHEET",
    "ARCHIVE",
    "PRODUCT",
    "ORDER",
    "INVOICE",
    "MANIFEST",
    "OTHER",
] as const;

/**
 * ============================================================================
 * Attachment Status
 * ============================================================================
 */

export const MESSAGE_ATTACHMENT_STATUSES = [
    "UPLOADING",
    "UPLOADED",
    "PROCESSING",
    "READY",
    "FAILED",
    "DELETED",
] as const;

/**
 * ============================================================================
 * Storage Providers
 * ============================================================================
 */

export const MESSAGE_ATTACHMENT_STORAGE_PROVIDERS = [
    "SUPABASE",
    "S3",
    "LOCAL",
] as const;

/**
 * ============================================================================
 * Image MIME Types
 * ============================================================================
 */

export const MESSAGE_ATTACHMENT_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
] as const;

/**
 * ============================================================================
 * Video MIME Types
 * ============================================================================
 */

export const MESSAGE_ATTACHMENT_VIDEO_MIME_TYPES = [
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-matroska",
] as const;

/**
 * ============================================================================
 * Audio MIME Types
 * ============================================================================
 */

export const MESSAGE_ATTACHMENT_AUDIO_MIME_TYPES = [
    "audio/mpeg",
    "audio/mp4",
    "audio/ogg",
    "audio/wav",
    "audio/webm",
] as const;

/**
 * ============================================================================
 * Document MIME Types
 * ============================================================================
 */

export const MESSAGE_ATTACHMENT_DOCUMENT_MIME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
] as const;

/**
 * ============================================================================
 * Database Limits
 * ============================================================================
 */

export const MESSAGE_ATTACHMENT_FILE_NAME_MAX_LENGTH =
    255;

export const MESSAGE_ATTACHMENT_ORIGINAL_NAME_MAX_LENGTH =
    255;

export const MESSAGE_ATTACHMENT_CONTENT_TYPE_MAX_LENGTH =
    150;

export const MESSAGE_ATTACHMENT_STORAGE_PATH_MAX_LENGTH =
    500;

export const MESSAGE_ATTACHMENT_BUCKET_NAME_MAX_LENGTH =
    100;

export const MESSAGE_ATTACHMENT_CHECKSUM_MAX_LENGTH =
    128;
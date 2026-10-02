/**
 * ============================================================
 * Product Video Database Constants
 * ============================================================
 *
 * Single source of truth for:
 *
 * - Database constraints
 * - Zod validation
 * - DTO validation
 * - API validation
 * - Frontend forms
 *
 * ============================================================
 */

export const PRODUCT_VIDEO_TITLE_MAX_LENGTH = 255;

export const PRODUCT_VIDEO_DESCRIPTION_MAX_LENGTH = 2_000;

export const PRODUCT_VIDEO_FILE_NAME_MAX_LENGTH = 255;

export const PRODUCT_VIDEO_STORAGE_PROVIDER_MAX_LENGTH = 50;

export const PRODUCT_VIDEO_STORAGE_PATH_MAX_LENGTH = 2_048;

export const PRODUCT_VIDEO_URL_MAX_LENGTH = 2_048;

export const PRODUCT_VIDEO_THUMBNAIL_URL_MAX_LENGTH = 2_048;

export const PRODUCT_VIDEO_MIME_TYPE_MAX_LENGTH = 100;

export const PRODUCT_VIDEO_CHECKSUM_MAX_LENGTH = 128;

export const PRODUCT_VIDEO_DEFAULT_DISPLAY_ORDER = 0;

export const PRODUCT_VIDEO_MAX_FILE_SIZE =
    500 * 1024 * 1024; // 500 MB

export const PRODUCT_VIDEO_MAX_DURATION_SECONDS =
    60 * 60; // 1 hour

export const PRODUCT_VIDEO_METADATA_MAX_SIZE =
    50_000;
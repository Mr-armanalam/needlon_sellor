/**
 * ============================================================
 * Product Image Database Constants
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

export const PRODUCT_IMAGE_FILE_NAME_MAX_LENGTH = 255;

export const PRODUCT_IMAGE_STORAGE_PROVIDER_MAX_LENGTH = 50;

export const PRODUCT_IMAGE_STORAGE_PATH_MAX_LENGTH = 2048;

export const PRODUCT_IMAGE_URL_MAX_LENGTH = 2048;

export const PRODUCT_IMAGE_ALT_TEXT_MAX_LENGTH = 500;

export const PRODUCT_IMAGE_MIME_TYPE_MAX_LENGTH = 100;

export const PRODUCT_IMAGE_CHECKSUM_MAX_LENGTH = 128;

export const PRODUCT_IMAGE_DEFAULT_DISPLAY_ORDER = 0;

export const PRODUCT_IMAGE_MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export const PRODUCT_IMAGE_METADATA_MAX_SIZE = 20_000;
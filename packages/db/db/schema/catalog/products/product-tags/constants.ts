/**
 * ============================================================
 * Product Tag Database Constants
 * ============================================================
 *
 * Single source of truth for:
 *
 * - Database constraints
 * - Validation
 * - DTOs
 * - API
 * - Frontend forms
 *
 * ============================================================
 */

/**
 * Maximum tag name length.
 */
export const PRODUCT_TAG_NAME_MAX_LENGTH =
    100;

/**
 * Maximum slug length.
 */
export const PRODUCT_TAG_SLUG_MAX_LENGTH =
    120;

/**
 * Maximum description length.
 */
export const PRODUCT_TAG_DESCRIPTION_MAX_LENGTH =
    500;

/**
 * Maximum color length.
 *
 * Examples:
 * #FF5722
 * primary
 */
export const PRODUCT_TAG_COLOR_MAX_LENGTH =
    30;

/**
 * Maximum icon identifier length.
 *
 * Examples:
 * tag
 * star
 * flame
 * sparkles
 */
export const PRODUCT_TAG_ICON_MAX_LENGTH =
    100;

/**
 * Maximum metadata JSON size.
 */
export const PRODUCT_TAG_METADATA_MAX_SIZE =
    10_000;
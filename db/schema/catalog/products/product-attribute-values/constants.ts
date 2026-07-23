/**
 * ============================================================
 * Product Attribute Value Database Constants
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
 * Maximum size of metadata JSON.
 */
export const PRODUCT_ATTRIBUTE_VALUE_METADATA_MAX_SIZE =
    10_000;

/**
 * Maximum display value length.
 *
 * Used for:
 * - Admin UI
 * - Product pages
 * - Search
 * - Exports
 */
export const PRODUCT_ATTRIBUTE_DISPLAY_VALUE_MAX_LENGTH =
    255;
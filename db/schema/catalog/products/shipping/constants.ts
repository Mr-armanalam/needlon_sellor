/**
 * ============================================================
 * Shipping Database Constants
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
export const SHIPPING_METADATA_MAX_SIZE =
    10_000;

/**
 * Precision for weight values.
 *
 * Example:
 * 9999999.999
 */
export const SHIPPING_WEIGHT_PRECISION = 10;

/**
 * Scale for weight values.
 */
export const SHIPPING_WEIGHT_SCALE = 3;

/**
 * Precision for dimensions.
 *
 * Example:
 * 99999999.99
 */
export const SHIPPING_DIMENSION_PRECISION =
    10;

/**
 * Scale for dimensions.
 */
export const SHIPPING_DIMENSION_SCALE = 2;
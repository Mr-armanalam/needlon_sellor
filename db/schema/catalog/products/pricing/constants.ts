/**
 * ============================================================
 * Pricing Database Constants
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
export const PRICING_METADATA_MAX_SIZE =
    10_000;

/**
 * ISO-4217 currency code length.
 *
 * Examples:
 * INR
 * USD
 * EUR
 */
export const PRICING_CURRENCY_CODE_LENGTH = 3;

/**
 * Precision for monetary values.
 */
export const PRICING_AMOUNT_PRECISION = 12;

/**
 * Scale for monetary values.
 */
export const PRICING_AMOUNT_SCALE = 2;
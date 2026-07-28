/**
 * ============================================================
 * Product AI Database Constants
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
 * Maximum AI-generated summary length.
 */
export const PRODUCT_AI_SUMMARY_MAX_LENGTH =
    2_000;

/**
 * Maximum AI-generated SEO title length.
 */
export const PRODUCT_AI_SEO_TITLE_MAX_LENGTH =
    255;

/**
 * Maximum AI-generated SEO description length.
 */
export const PRODUCT_AI_SEO_DESCRIPTION_MAX_LENGTH =
    500;

/**
 * Maximum moderation reason length.
 */
export const PRODUCT_AI_MODERATION_REASON_MAX_LENGTH =
    1_000;

/**
 * Maximum AI model identifier length.
 *
 * Examples:
 * - gpt-5.5
 * - gpt-6
 * - gemini-2.5-pro
 * - claude-opus-4
 * - needlon-ai-v1
 */
export const PRODUCT_AI_MODEL_MAX_LENGTH =
    100;

/**
 * Maximum metadata JSON size.
 */
export const PRODUCT_AI_METADATA_MAX_SIZE =
    50_000;

/**
 * AI score limits.
 */
export const PRODUCT_AI_SCORE_MIN = 0;

export const PRODUCT_AI_SCORE_MAX = 100;
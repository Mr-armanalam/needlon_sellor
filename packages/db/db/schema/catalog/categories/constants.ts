/**
 * ============================================================
 * Categories Database Constants
 * ============================================================
 *
 * Single source of truth for database constraints.
 * These constants should also be reused by:
 *
 * - Zod validation
 * - DTO validation
 * - API layer
 * - Frontend forms
 *
 * ============================================================
 */

export const CATEGORY_NAME_MAX_LENGTH = 150;

export const CATEGORY_DISPLAY_NAME_MAX_LENGTH = 150;

export const CATEGORY_SLUG_MAX_LENGTH = 180;

export const CATEGORY_CODE_MAX_LENGTH = 50;

export const CATEGORY_DEFAULT_LEVEL = 0;

export const CATEGORY_DEFAULT_SORT_ORDER = 0;

export const CATEGORY_MAX_LEVEL = 10;

/**
 * Maximum metadata payload size.
 *
 * Used only for validation.
 * PostgreSQL JSONB itself has no practical limit here.
 */
export const CATEGORY_METADATA_MAX_SIZE = 10_000;
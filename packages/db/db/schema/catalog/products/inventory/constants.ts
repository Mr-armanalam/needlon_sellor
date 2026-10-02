/**
 * ============================================================
 * Inventory Database Constants
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
export const INVENTORY_METADATA_MAX_SIZE =
    10_000;

/**
 * Maximum SKU length.
 */
export const INVENTORY_SKU_MAX_LENGTH = 100;

/**
 * Maximum barcode length.
 */
export const INVENTORY_BARCODE_MAX_LENGTH =
    100;
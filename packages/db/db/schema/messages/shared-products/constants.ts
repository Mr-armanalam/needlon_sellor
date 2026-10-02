// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/shared-products/constants.ts
// Description:
// Shared constants for Product Share messages.
// ============================================================================

/**
 * ============================================================================
 * Share Status
 * ============================================================================
 *
 * Represents the lifecycle of a shared product.
 */

export const SHARED_PRODUCT_STATUSES = [
    "ACTIVE",
    "PRODUCT_UPDATED",
    "PRODUCT_UNAVAILABLE",
    "PRODUCT_DELETED",
    "EXPIRED",
] as const;

/**
 * ============================================================================
 * Share Source
 * ============================================================================
 *
 * Indicates where the product share
 * originated.
 */

export const SHARED_PRODUCT_SOURCES = [
    "PRODUCT_PAGE",
    "PRODUCT_CARD",
    "SEARCH",
    "CATEGORY",
    "STORE",
    "RECOMMENDATION",
    "SYSTEM",
] as const;

/**
 * ============================================================================
 * Price Snapshot Status
 * ============================================================================
 *
 * Indicates whether the shared price
 * still matches the current catalog.
 */

export const SHARED_PRODUCT_PRICE_STATUSES = [
    "CURRENT",
    "PRICE_CHANGED",
    "DISCOUNT_APPLIED",
    "UNAVAILABLE",
] as const;

/**
 * ============================================================================
 * Database Limits
 * ============================================================================
 */

export const SHARED_PRODUCT_NAME_MAX_LENGTH =
    255;

export const SHARED_PRODUCT_SLUG_MAX_LENGTH =
    255;

export const SHARED_PRODUCT_BRAND_MAX_LENGTH =
    150;

export const SHARED_PRODUCT_IMAGE_URL_MAX_LENGTH =
    2048;

export const SHARED_PRODUCT_CURRENCY_MAX_LENGTH =
    3;

export const SHARED_PRODUCT_SKU_MAX_LENGTH =
    100;
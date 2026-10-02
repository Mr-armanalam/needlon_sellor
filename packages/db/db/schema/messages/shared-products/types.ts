// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/shared-products/types.ts
// Description:
// Shared TypeScript types derived from Shared Product constants.
// ============================================================================

import {
    SHARED_PRODUCT_STATUSES,
    SHARED_PRODUCT_SOURCES,
    SHARED_PRODUCT_PRICE_STATUSES,
    SHARED_PRODUCT_NAME_MAX_LENGTH,
    SHARED_PRODUCT_SLUG_MAX_LENGTH,
    SHARED_PRODUCT_BRAND_MAX_LENGTH,
    SHARED_PRODUCT_IMAGE_URL_MAX_LENGTH,
    SHARED_PRODUCT_CURRENCY_MAX_LENGTH,
    SHARED_PRODUCT_SKU_MAX_LENGTH,
} from "./constants";

/**
 * ============================================================================
 * Shared Product
 * ============================================================================
 */

export type SharedProductStatus =
    (typeof SHARED_PRODUCT_STATUSES)[number];

export type SharedProductSource =
    (typeof SHARED_PRODUCT_SOURCES)[number];

export type SharedProductPriceStatus =
    (typeof SHARED_PRODUCT_PRICE_STATUSES)[number];

/**
 * ============================================================================
 * Constant Maps
 * ============================================================================
 */

export const SharedProductStatus =
    SHARED_PRODUCT_STATUSES.reduce(
        (acc, value) => {
            acc[value] = value;

            return acc;
        },
        {} as Record<
            SharedProductStatus,
            SharedProductStatus
        >,
    );

export const SharedProductSource =
    SHARED_PRODUCT_SOURCES.reduce(
        (acc, value) => {
            acc[value] = value;

            return acc;
        },
        {} as Record<
            SharedProductSource,
            SharedProductSource
        >,
    );

export const SharedProductPriceStatus =
    SHARED_PRODUCT_PRICE_STATUSES.reduce(
        (acc, value) => {
            acc[value] = value;

            return acc;
        },
        {} as Record<
            SharedProductPriceStatus,
            SharedProductPriceStatus
        >,
    );

/**
 * ============================================================================
 * Constraints
 * ============================================================================
 */

export interface SharedProductConstraints {
    readonly maxNameLength: typeof SHARED_PRODUCT_NAME_MAX_LENGTH;

    readonly maxSlugLength: typeof SHARED_PRODUCT_SLUG_MAX_LENGTH;

    readonly maxBrandLength: typeof SHARED_PRODUCT_BRAND_MAX_LENGTH;

    readonly maxImageUrlLength: typeof SHARED_PRODUCT_IMAGE_URL_MAX_LENGTH;

    readonly maxCurrencyLength: typeof SHARED_PRODUCT_CURRENCY_MAX_LENGTH;

    readonly maxSkuLength: typeof SHARED_PRODUCT_SKU_MAX_LENGTH;
}

export const SharedProductConstraints: SharedProductConstraints =
    Object.freeze({
        maxNameLength:
        SHARED_PRODUCT_NAME_MAX_LENGTH,

        maxSlugLength:
        SHARED_PRODUCT_SLUG_MAX_LENGTH,

        maxBrandLength:
        SHARED_PRODUCT_BRAND_MAX_LENGTH,

        maxImageUrlLength:
        SHARED_PRODUCT_IMAGE_URL_MAX_LENGTH,

        maxCurrencyLength:
        SHARED_PRODUCT_CURRENCY_MAX_LENGTH,

        maxSkuLength:
        SHARED_PRODUCT_SKU_MAX_LENGTH,
    });
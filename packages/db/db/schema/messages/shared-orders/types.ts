// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/shared-orders/types.ts
// Description:
// Shared TypeScript types derived from Shared Order constants.
// ============================================================================

import {
    SHARED_ORDER_STATUSES,
    SHARED_ORDER_SOURCES,
    SHARED_ORDER_DELIVERY_STATUSES,
    SHARED_ORDER_PAYMENT_STATUSES,
    SHARED_ORDER_NUMBER_MAX_LENGTH,
    SHARED_ORDER_CURRENCY_MAX_LENGTH,
    SHARED_ORDER_TRACKING_NUMBER_MAX_LENGTH,
    SHARED_ORDER_COURIER_NAME_MAX_LENGTH,
    SHARED_ORDER_BUYER_NAME_MAX_LENGTH,
    SHARED_ORDER_SELLER_NAME_MAX_LENGTH,
} from "./constants";

/**
 * ============================================================================
 * Shared Order
 * ============================================================================
 */

export type SharedOrderStatus =
    (typeof SHARED_ORDER_STATUSES)[number];

export type SharedOrderSource =
    (typeof SHARED_ORDER_SOURCES)[number];

export type SharedOrderDeliveryStatus =
    (typeof SHARED_ORDER_DELIVERY_STATUSES)[number];

export type SharedOrderPaymentStatus =
    (typeof SHARED_ORDER_PAYMENT_STATUSES)[number];

/**
 * ============================================================================
 * Constant Maps
 * ============================================================================
 */

export const SharedOrderStatus =
    SHARED_ORDER_STATUSES.reduce(
        (acc, value) => {
            acc[value] = value;

            return acc;
        },
        {} as Record<
            SharedOrderStatus,
            SharedOrderStatus
        >,
    );

export const SharedOrderSource =
    SHARED_ORDER_SOURCES.reduce(
        (acc, value) => {
            acc[value] = value;

            return acc;
        },
        {} as Record<
            SharedOrderSource,
            SharedOrderSource
        >,
    );

export const SharedOrderDeliveryStatus =
    SHARED_ORDER_DELIVERY_STATUSES.reduce(
        (acc, value) => {
            acc[value] = value;

            return acc;
        },
        {} as Record<
            SharedOrderDeliveryStatus,
            SharedOrderDeliveryStatus
        >,
    );

export const SharedOrderPaymentStatus =
    SHARED_ORDER_PAYMENT_STATUSES.reduce(
        (acc, value) => {
            acc[value] = value;

            return acc;
        },
        {} as Record<
            SharedOrderPaymentStatus,
            SharedOrderPaymentStatus
        >,
    );

/**
 * ============================================================================
 * Constraints
 * ============================================================================
 */

export interface SharedOrderConstraints {
    readonly maxOrderNumberLength: typeof SHARED_ORDER_NUMBER_MAX_LENGTH;

    readonly maxCurrencyLength: typeof SHARED_ORDER_CURRENCY_MAX_LENGTH;

    readonly maxTrackingNumberLength: typeof SHARED_ORDER_TRACKING_NUMBER_MAX_LENGTH;

    readonly maxCourierNameLength: typeof SHARED_ORDER_COURIER_NAME_MAX_LENGTH;

    readonly maxBuyerNameLength: typeof SHARED_ORDER_BUYER_NAME_MAX_LENGTH;

    readonly maxSellerNameLength: typeof SHARED_ORDER_SELLER_NAME_MAX_LENGTH;
}

export const SharedOrderConstraints: SharedOrderConstraints =
    Object.freeze({
        maxOrderNumberLength:
        SHARED_ORDER_NUMBER_MAX_LENGTH,

        maxCurrencyLength:
        SHARED_ORDER_CURRENCY_MAX_LENGTH,

        maxTrackingNumberLength:
        SHARED_ORDER_TRACKING_NUMBER_MAX_LENGTH,

        maxCourierNameLength:
        SHARED_ORDER_COURIER_NAME_MAX_LENGTH,

        maxBuyerNameLength:
        SHARED_ORDER_BUYER_NAME_MAX_LENGTH,

        maxSellerNameLength:
        SHARED_ORDER_SELLER_NAME_MAX_LENGTH,
    });
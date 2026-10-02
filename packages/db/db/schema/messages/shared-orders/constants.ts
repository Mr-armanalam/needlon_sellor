// ============================================================================
// Needlon
// Messages Module
// File: db/schema/messages/shared-orders/constants.ts
// Description:
// Shared constants for Order Share messages.
// ============================================================================

/**
 * ============================================================================
 * Share Status
 * ============================================================================
 *
 * Represents the lifecycle of a shared order snapshot.
 */

export const SHARED_ORDER_STATUSES = [
    "ACTIVE",
    "ORDER_UPDATED",
    "ORDER_CANCELLED",
    "ORDER_COMPLETED",
    "ORDER_DELETED",
    "EXPIRED",
] as const;

/**
 * ============================================================================
 * Share Source
 * ============================================================================
 *
 * Indicates where the order was shared from.
 */

export const SHARED_ORDER_SOURCES = [
    "ORDER_DETAILS",
    "ORDER_HISTORY",
    "SELLER_DASHBOARD",
    "BUYER_DASHBOARD",
    "TRACKING_PAGE",
    "SYSTEM",
] as const;

/**
 * ============================================================================
 * Delivery Status Snapshot
 * ============================================================================
 *
 * Snapshot of the order delivery state
 * at the time it was shared.
 */

export const SHARED_ORDER_DELIVERY_STATUSES = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "PACKED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
    "REFUNDED",
] as const;

/**
 * ============================================================================
 * Payment Status Snapshot
 * ============================================================================
 */

export const SHARED_ORDER_PAYMENT_STATUSES = [
    "PENDING",
    "AUTHORIZED",
    "PAID",
    "PARTIALLY_PAID",
    "FAILED",
    "REFUNDED",
    "PARTIALLY_REFUNDED",
    "COD",
] as const;

/**
 * ============================================================================
 * Database Limits
 * ============================================================================
 */

export const SHARED_ORDER_NUMBER_MAX_LENGTH =
    100;

export const SHARED_ORDER_CURRENCY_MAX_LENGTH =
    3;

export const SHARED_ORDER_TRACKING_NUMBER_MAX_LENGTH =
    150;

export const SHARED_ORDER_COURIER_NAME_MAX_LENGTH =
    150;

export const SHARED_ORDER_BUYER_NAME_MAX_LENGTH =
    200;

export const SHARED_ORDER_SELLER_NAME_MAX_LENGTH =
    200;
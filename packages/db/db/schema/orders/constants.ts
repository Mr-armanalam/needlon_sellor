// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/constants.ts
// Description: Order constants & PostgreSQL enums
// Phase: 6.1.1
// ============================================================================

import {
  pgEnum,
} from "drizzle-orm/pg-core";

/* ============================================================================
 * Order Status
 * ============================================================================
 *
 * Complete order lifecycle.
 * ========================================================================== */

export const orderStatusEnum =
  pgEnum("order_status", [
    "DRAFT",
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "READY_TO_SHIP",
    "PARTIALLY_SHIPPED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "COMPLETED",
    "CANCELLED",
    "RETURN_REQUESTED",
    "RETURN_APPROVED",
    "RETURN_REJECTED",
    "RETURNED",
    "REFUND_PENDING",
    "REFUNDED",
    "FAILED",
  ]);


/* ============================================================================
 * Order Source
 * ========================================================================== */

export const orderSourceEnum =
  pgEnum("order_source", [
    "WEB",
    "ANDROID",
    "IOS",
    "ADMIN",
    "API",
  ]);

/* ============================================================================
 * Currency
 * ========================================================================== */

export const ORDER_DEFAULT_CURRENCY =
  "INR";

export const ORDER_CURRENCY_PRECISION =
  2;


/* ============================================================================
 * Search
 * ========================================================================== */

export const ORDER_SEARCH_MIN_LENGTH =
  2;

/* ============================================================================
 * Timeline
 * ========================================================================== */

export const ORDER_CANCEL_WINDOW_MINUTES =
  30;

/* ============================================================================
 * Labels
 * ========================================================================== */

export const ORDER_STATUS_LABELS = {
  DRAFT: "Draft",
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  READY_TO_SHIP: "Ready to Ship",
  PARTIALLY_SHIPPED: "Partially Shipped",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  RETURN_REQUESTED: "Return Requested",
  RETURN_APPROVED: "Return Approved",
  RETURN_REJECTED: "Return Rejected",
  RETURNED: "Returned",
  REFUND_PENDING: "Refund Pending",
  REFUNDED: "Refunded",
  FAILED: "Failed",
} as const;

/* ============================================================================
 * Active States
 * ========================================================================== */

export const ORDER_ACTIVE_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "READY_TO_SHIP",
  "PARTIALLY_SHIPPED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
] as const;

/* ============================================================================
 * Final States
 * ========================================================================== */

export const ORDER_FINAL_STATUSES = [
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
  "FAILED",
] as const;

/* ============================================================================
 * Dashboard Filters
 * ========================================================================== */

export const ORDER_DEFAULT_STATUS_FILTERS = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
] as const;

/* ============================================================================
 * Payment Status
 * ========================================================================== */

export const paymentStatusEnum =
  pgEnum("order_payment_status", [
    "PENDING",
    "AUTHORIZED",
    "PARTIALLY_PAID",
    "PAID",
    "FAILED",
    "REFUNDED",
    "PARTIALLY_REFUNDED",
    "CANCELLED",
  ]);

/* ============================================================================
 * Payment Method
 * ========================================================================== */

export const paymentMethodEnum =
  pgEnum("order_payment_method", [
    "COD",
    "UPI",
    "CARD",
    "NET_BANKING",
    "WALLET",
    "BANK_TRANSFER",
  ]);

/* ============================================================================
 * Shipping Method
 * ========================================================================== */

export const shippingMethodEnum =
  pgEnum("shipping_method", [
    "STANDARD",
    "EXPRESS",
    "SAME_DAY",
    "NEXT_DAY",
    "STORE_PICKUP",
  ]);

/* ============================================================================
 * Order Priority
 * ========================================================================== */

export const orderPriorityEnum =
  pgEnum("order_priority", [
    "LOW",
    "NORMAL",
    "HIGH",
    "URGENT",
  ]);
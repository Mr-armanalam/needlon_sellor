// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-status-history/constants.ts
// Description: Order Status History constants & PostgreSQL enums
// Phase: 6.3.1
// ============================================================================

import { pgEnum } from "drizzle-orm/pg-core";

/* ============================================================================
 * Status Transition Action
 * ============================================================================
 *
 * Represents the action that triggered the status transition.
 * ============================================================================
 */

export const orderStatusActionEnum = pgEnum(
  "order_status_action",
  [
    "CREATED",
    "UPDATED",
    "ACCEPTED",
    "REJECTED",
    "PACKED",
    "READY_FOR_SHIPMENT",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
    "RETURN_REQUESTED",
    "RETURN_APPROVED",
    "RETURN_REJECTED",
    "RETURN_RECEIVED",
    "REFUND_INITIATED",
    "REFUNDED",
    "RESTORED",
    "ARCHIVED",
    "SYSTEM_UPDATE",
  ],
);

/* ============================================================================
 * Transition Source
 * ============================================================================
 *
 * Identifies where the transition originated.
 * ============================================================================
 */

export const orderStatusSourceEnum = pgEnum(
  "order_status_source",
  [
    "BUYER",
    "SELLER",
    "ADMIN",
    "SYSTEM",
    "PAYMENT_GATEWAY",
    "DELIVERY_PARTNER",
    "API",
    "CRON",
    "WEBHOOK",
  ],
);

/* ============================================================================
 * Transition Result
 * ============================================================================
 */

export const orderStatusResultEnum = pgEnum(
  "order_status_result",
  [
    "SUCCESS",
    "FAILED",
    "ROLLED_BACK",
  ],
);

/* ============================================================================
 * Validation
 * ============================================================================
 */

export const ORDER_STATUS_HISTORY_MAX_REMARK_LENGTH = 5000;

export const ORDER_STATUS_HISTORY_MAX_REASON_LENGTH = 1000;

export const ORDER_STATUS_HISTORY_MAX_REFERENCE_LENGTH = 255;

export const ORDER_STATUS_HISTORY_MAX_IP_LENGTH = 45;

export const ORDER_STATUS_HISTORY_MAX_USER_AGENT_LENGTH = 1000;

/* ============================================================================
 * Pagination
 * ============================================================================
 */

export const ORDER_STATUS_HISTORY_DEFAULT_PAGE_SIZE = 50;

export const ORDER_STATUS_HISTORY_MAX_PAGE_SIZE = 200;

/* ============================================================================
 * Search
 * ============================================================================
 */

export const ORDER_STATUS_HISTORY_SEARCHABLE_FIELDS = [
  "reason",
  "remarks",
  "referenceId",
] as const;

/* ============================================================================
 * Export
 * ============================================================================
 */

export const ORDER_STATUS_HISTORY_EXPORTABLE_FIELDS = [
  "fromStatus",
  "toStatus",
  "action",
  "source",
  "result",
  "reason",
  "changedAt",
] as const;

/* ============================================================================
 * Defaults
 * ============================================================================
 */

export const ORDER_STATUS_HISTORY_DEFAULT_RESULT =
  "SUCCESS" as const;

export const ORDER_STATUS_HISTORY_DEFAULT_SOURCE =
  "SYSTEM" as const;
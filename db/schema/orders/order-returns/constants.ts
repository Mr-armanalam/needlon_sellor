// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-returns/constants.ts
// Description: Order Return constants & PostgreSQL enums
// Phase: 6.6.1
// ============================================================================

import {
  pgEnum,
} from "drizzle-orm/pg-core";

/* ============================================================================
 * Return Status
 * ============================================================================
 *
 * Complete lifecycle of a return request.
 * ========================================================================== */

export const orderReturnStatusEnum =
  pgEnum("order_return_status", [
    "REQUESTED",
    "APPROVED",
    "REJECTED",
    "AWAITING_PICKUP",
    "PICKED_UP",
    "IN_TRANSIT",
    "RECEIVED",
    "INSPECTING",
    "APPROVED_FOR_REFUND",
    "REFUND_INITIATED",
    "REFUNDED",
    "REPLACEMENT_INITIATED",
    "REPLACED",
    "COMPLETED",
    "CANCELLED",
  ]);

/* ============================================================================
 * Return Type
 * ============================================================================
 */

export const orderReturnTypeEnum =
  pgEnum("order_return_type", [
    "RETURN_AND_REFUND",
    "RETURN_AND_REPLACE",
    "RETURN_AND_EXCHANGE",
    "RETURN_ONLY",
  ]);

/* ============================================================================
 * Return Reason
 * ============================================================================
 *
 * Customer selected reason.
 * ========================================================================== */

export const orderReturnReasonEnum =
  pgEnum("order_return_reason", [
    "DAMAGED_PRODUCT",
    "DEFECTIVE_PRODUCT",
    "WRONG_PRODUCT",
    "WRONG_SIZE",
    "MISSING_ITEMS",
    "QUALITY_NOT_AS_EXPECTED",
    "NOT_AS_DESCRIBED",
    "COLOR_MISMATCH",
    "DUPLICATE_ORDER",
    "ORDERED_BY_MISTAKE",
    "LATE_DELIVERY",
    "DELIVERED_AFTER_EVENT",
    "NO_LONGER_NEEDED",
    "OTHER",
  ]);

/* ============================================================================
 * Return Approval
 * ============================================================================
 */

export const orderReturnApprovalStatusEnum =
  pgEnum(
    "order_return_approval_status",
    [
      "PENDING",
      "APPROVED",
      "REJECTED",
      "AUTO_APPROVED",
    ],
  );

/* ============================================================================
 * Return Condition
 * ============================================================================
 *
 * Condition after warehouse inspection.
 * ========================================================================== */

export const orderReturnConditionEnum =
  pgEnum("order_return_condition", [
    "SEALED",
    "UNUSED",
    "USED",
    "DAMAGED",
    "DEFECTIVE",
    "MISSING_PARTS",
    "NOT_RESELLABLE",
  ]);

/* ============================================================================
 * Pickup Status
 * ============================================================================
 */

export const orderReturnPickupStatusEnum =
  pgEnum("order_return_pickup_status", [
    "NOT_REQUIRED",
    "PENDING",
    "SCHEDULED",
    "PICKED_UP",
    "FAILED",
    "CANCELLED",
  ]);

/* ============================================================================
 * Inspection Result
 * ============================================================================
 */

export const orderReturnInspectionResultEnum =
  pgEnum(
    "order_return_inspection_result",
    [
      "PENDING",
      "PASSED",
      "FAILED",
      "PARTIALLY_ACCEPTED",
    ],
  );

/* ============================================================================
 * Refund Status
 * ============================================================================
 */

export const orderReturnRefundStatusEnum =
  pgEnum(
    "order_return_refund_status",
    [
      "NOT_APPLICABLE",
      "PENDING",
      "INITIATED",
      "PROCESSING",
      "COMPLETED",
      "FAILED",
    ],
  );

/* ============================================================================
 * Replacement Status
 * ============================================================================
 */

export const orderReturnReplacementStatusEnum =
  pgEnum(
    "order_return_replacement_status",
    [
      "NOT_APPLICABLE",
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "COMPLETED",
      "FAILED",
    ],
  );

/* ============================================================================
 * Labels
 * ============================================================================
 */

export const ORDER_RETURN_STATUS_LABELS = {
  REQUESTED: "Requested",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  AWAITING_PICKUP: "Awaiting Pickup",
  PICKED_UP: "Picked Up",
  IN_TRANSIT: "In Transit",
  RECEIVED: "Received",
  INSPECTING: "Inspecting",
  APPROVED_FOR_REFUND:
    "Approved For Refund",
  REFUND_INITIATED:
    "Refund Initiated",
  REFUNDED: "Refunded",
  REPLACEMENT_INITIATED:
    "Replacement Initiated",
  REPLACED: "Replaced",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

/* ============================================================================
 * Configuration
 * ============================================================================
 */

export const ORDER_RETURN_NUMBER_PREFIX =
  "RET";

export const ORDER_RETURN_NUMBER_PADDING =
  8;

export const ORDER_RETURN_DEFAULT_CURRENCY =
  "INR";

export const ORDER_RETURN_MAX_IMAGES =
  10;

export const ORDER_RETURN_MAX_VIDEOS =
  3;

export const ORDER_RETURN_MAX_ATTACHMENTS =
  10;

export const ORDER_RETURN_DEFAULT_PAGE_SIZE =
  20;

export const ORDER_RETURN_MAX_PAGE_SIZE =
  100;
// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-refunds/constants.ts
// Description: Order Refund constants & PostgreSQL enums
// Phase: 6.7.1
// ============================================================================

import {
  pgEnum,
} from "drizzle-orm/pg-core";

/* ============================================================================
 * Refund Status
 * ============================================================================
 *
 * Complete lifecycle of a refund.
 * ========================================================================== */

export const orderRefundStatusEnum =
  pgEnum("order_refund_status", [
    "PENDING",
    "INITIATED",
    "PROCESSING",
    "APPROVED",
    "REJECTED",
    "SUCCESS",
    "FAILED",
    "CANCELLED",
  ]);

/* ============================================================================
 * Refund Type
 * ============================================================================
 */

export const orderRefundTypeEnum =
  pgEnum("order_refund_type", [
    "FULL",
    "PARTIAL",
    "SHIPPING_ONLY",
    "ITEM_ONLY",
    "GOODWILL",
    "ADJUSTMENT",
  ]);

/* ============================================================================
 * Refund Reason
 * ============================================================================
 */

export const orderRefundReasonEnum =
  pgEnum("order_refund_reason", [
    "RETURN_APPROVED",
    "ORDER_CANCELLED",
    "PAYMENT_FAILED",
    "PAYMENT_DUPLICATE",
    "DAMAGED_PRODUCT",
    "DEFECTIVE_PRODUCT",
    "WRONG_PRODUCT",
    "MISSING_ITEMS",
    "PRICE_ADJUSTMENT",
    "CUSTOMER_REQUEST",
    "SELLER_APPROVED",
    "ADMIN_APPROVED",
    "FRAUD_REVERSAL",
    "OTHER",
  ]);

/* ============================================================================
 * Refund Method
 * ============================================================================
 */

export const orderRefundMethodEnum =
  pgEnum("order_refund_method", [
    "ORIGINAL_PAYMENT_METHOD",
    "BANK_TRANSFER",
    "UPI",
    "WALLET",
    "STORE_CREDIT",
    "MANUAL",
  ]);

/* ============================================================================
 * Refund Gateway
 * ============================================================================
 */

export const orderRefundGatewayEnum =
  pgEnum("order_refund_gateway", [
    "NONE",
    "RAZORPAY",
    "STRIPE",
    "PHONEPE",
    "PAYU",
    "CASHFREE",
    "CCAVENUE",
    "OFFLINE",
    "OTHER",
  ]);

/* ============================================================================
 * Refund Approval
 * ============================================================================
 */

export const orderRefundApprovalStatusEnum =
  pgEnum(
    "order_refund_approval_status",
    [
      "PENDING",
      "APPROVED",
      "REJECTED",
      "AUTO_APPROVED",
    ],
  );

/* ============================================================================
 * Refund Labels
 * ============================================================================
 */

export const ORDER_REFUND_STATUS_LABELS = {
  PENDING: "Pending",
  INITIATED: "Initiated",
  PROCESSING: "Processing",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  SUCCESS: "Success",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
} as const;

/* ============================================================================
 * Configuration
 * ============================================================================
 */

export const ORDER_REFUND_NUMBER_PREFIX =
  "RFD";

export const ORDER_REFUND_NUMBER_PADDING =
  8;

export const ORDER_REFUND_DEFAULT_CURRENCY =
  "INR";

export const ORDER_REFUND_DEFAULT_PAGE_SIZE =
  20;

export const ORDER_REFUND_MAX_PAGE_SIZE =
  100;

export const ORDER_REFUND_MAX_RETRY_COUNT =
  3;

export const ORDER_REFUND_WEBHOOK_TIMEOUT_SECONDS =
  30;

/* ============================================================================
 * Retry Configuration
 * ============================================================================
 */

export const ORDER_REFUND_RETRY_DELAYS = [
  60,
  300,
  900,
] as const;

/* ============================================================================
 * Supported Payment Gateways
 * ============================================================================
 */

export const ORDER_REFUND_SUPPORTED_GATEWAYS =
  [
    "RAZORPAY",
    "STRIPE",
    "PHONEPE",
    "PAYU",
    "CASHFREE",
    "CCAVENUE",
  ] as const;

/* ============================================================================
 * Refund States
 * ============================================================================
 */

export const ORDER_REFUND_FINAL_STATES = [
  "SUCCESS",
  "FAILED",
  "CANCELLED",
] as const;

export const ORDER_REFUND_ACTIVE_STATES = [
  "PENDING",
  "INITIATED",
  "PROCESSING",
  "APPROVED",
] as const;


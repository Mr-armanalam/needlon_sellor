// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-payments/constants.ts
// Description: Order Payment Constants & Enums
// Phase: 6.5.1
// ============================================================================

import { pgEnum } from "drizzle-orm/pg-core";

/* ============================================================================
 * Payment Transaction Type
 * ============================================================================
 */

export const paymentTransactionTypeEnum = pgEnum(
  "payment_transaction_type",
  [
    "PAYMENT",
    "PARTIAL_PAYMENT",
    "CAPTURE",
    "REFUND",
    "PARTIAL_REFUND",
    "REVERSAL",
    "VOID",
    "CHARGEBACK",
    "CHARGEBACK_REVERSAL",
  ],
);

/* ============================================================================
 * Payment Gateway
 * ============================================================================
 */

export const paymentGatewayEnum = pgEnum("order_payment_gateway", [
  "RAZORPAY",
  "PHONEPE",
  "PAYTM",
  "CASHFREE",
  "STRIPE",
  "COD",
  "BANK_TRANSFER",
  "UPI",
  "OTHER",
]);

/* ============================================================================
 * Payment Mode
 * ============================================================================
 */

export const paymentModeEnum = pgEnum("payment_mode", [
  "ONLINE",
  "OFFLINE",
]);

/* ============================================================================
 * Payment Capture Status
 * ============================================================================
 */

export const paymentCaptureStatusEnum = pgEnum(
  "payment_capture_status",
  [
    "NOT_REQUIRED",
    "AUTHORIZED",
    "CAPTURED",
    "PARTIALLY_CAPTURED",
    "FAILED",
    "VOIDED",
  ],
);

/* ============================================================================
 * Payment Verification Status
 * ============================================================================
 */

export const paymentVerificationStatusEnum = pgEnum(
  "payment_verification_status",
  [
    "PENDING",
    "VERIFIED",
    "FAILED",
    "MANUAL_REVIEW",
  ],
);

/* ============================================================================
 * Settlement Status
 * ============================================================================
 */

export const settlementStatusEnum = pgEnum("settlement_status", [
  "PENDING",
  "PROCESSING",
  "SETTLED",
  "FAILED",
]);

/* ============================================================================
 * Failure Category
 * ============================================================================
 */

export const paymentFailureCategoryEnum = pgEnum(
  "payment_failure_category",
  [
    "CUSTOMER",
    "BANK",
    "GATEWAY",
    "NETWORK",
    "SYSTEM",
    "UNKNOWN",
  ],
);

/* ============================================================================
 * Fraud Review Status
 * ============================================================================
 */

export const paymentFraudStatusEnum = pgEnum("payment_fraud_status", [
  "NOT_CHECKED",
  "LOW_RISK",
  "MEDIUM_RISK",
  "HIGH_RISK",
  "BLOCKED",
]);

/* ============================================================================
 * Currency
 * ============================================================================
 */

export const DEFAULT_CURRENCY = "INR";

/* ============================================================================
 * Amount Precision
 * ============================================================================
 */

export const PAYMENT_AMOUNT = {
  PRECISION: 12,
  SCALE: 2,
} as const;

/* ============================================================================
 * Reference Lengths
 * ============================================================================
 */

export const PAYMENT_REFERENCE = {
  MAX_TRANSACTION_ID_LENGTH: 150,
  MAX_GATEWAY_REFERENCE_LENGTH: 150,
  MAX_PAYMENT_REFERENCE_LENGTH: 150,
  MAX_ORDER_REFERENCE_LENGTH: 100,
} as const;

/* ============================================================================
 * Gateway Response
 * ============================================================================
 */

export const GATEWAY_RESPONSE = {
  MAX_CODE_LENGTH: 100,
  MAX_MESSAGE_LENGTH: 1000,
} as const;

/* ============================================================================
 * Notes
 * ============================================================================
 */

export const PAYMENT_NOTES = {
  MAX_INTERNAL_NOTE_LENGTH: 2000,
  MAX_FAILURE_REASON_LENGTH: 1000,
} as const;

/* ============================================================================
 * Receipt
 * ============================================================================
 */

export const PAYMENT_RECEIPT = {
  MAX_RECEIPT_URL_LENGTH: 2048,
} as const;

/* ============================================================================
 * Retry Policy
 * ============================================================================
 */

export const PAYMENT_RETRY = {
  MAX_RETRY_COUNT: 5,
} as const;

/* ============================================================================
 * Defaults
 * ============================================================================
 */

export const DEFAULT_PAYMENT_GATEWAY = "COD";
export const DEFAULT_PAYMENT_MODE = "OFFLINE";
export const DEFAULT_CAPTURE_STATUS = "NOT_REQUIRED";
export const DEFAULT_VERIFICATION_STATUS = "PENDING";
export const DEFAULT_SETTLEMENT_STATUS = "PENDING";
export const DEFAULT_FRAUD_STATUS = "NOT_CHECKED";
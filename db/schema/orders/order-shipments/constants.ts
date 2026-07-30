// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-shipments/constants.ts
// Description: Order Shipment Constants & Enums
// Phase: 6.4.1
// ============================================================================

import { pgEnum } from "drizzle-orm/pg-core";

/* ============================================================================
 * Shipment Status
 * ============================================================================
 */

export const shipmentStatusEnum = pgEnum("shipment_status", [
  "PENDING",
  "READY_TO_SHIP",
  "LABEL_GENERATED",
  "MANIFEST_GENERATED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "DELIVERY_FAILED",
  "RETURN_TO_ORIGIN",
  "RETURNED",
  "CANCELLED",
]);

/* ============================================================================
 * Shipping Method
 * ============================================================================
 */

export const shipmentMethodEnum = pgEnum("shipment_method", [
  "STANDARD",
  "EXPRESS",
  "SAME_DAY",
  "NEXT_DAY",
  "STORE_PICKUP",
]);

/* ============================================================================
 * Courier Partner
 * ============================================================================
 * Platform supported logistics providers.
 * Additional providers can be added without schema redesign.
 */

export const courierPartnerEnum = pgEnum("courier_partner", [
  "DELHIVERY",
  "BLUEDART",
  "DTDC",
  "EKART",
  "XPRESSBEES",
  "EKOM",
  "INDIA_POST",
  "SHADOWFAX",
  "OTHER",
]);

/* ============================================================================
 * Shipment Type
 * ============================================================================
 */

export const shipmentTypeEnum = pgEnum("shipment_type", [
  "FULL_ORDER",
  "PARTIAL_ORDER",
  "REPLACEMENT",
  "EXCHANGE",
  "RETURN",
]);

/* ============================================================================
 * Package Type
 * ============================================================================
 */

export const packageTypeEnum = pgEnum("package_type", [
  "BOX",
  "POLY_BAG",
  "ENVELOPE",
  "CUSTOM",
]);

/* ============================================================================
 * Delivery Attempt Status
 * ============================================================================
 */

export const deliveryAttemptStatusEnum = pgEnum(
  "delivery_attempt_status",
  [
    "NOT_ATTEMPTED",
    "ATTEMPTED",
    "FAILED",
    "RESCHEDULED",
    "DELIVERED",
  ],
);

/* ============================================================================
 * Shipping Label Status
 * ============================================================================
 */

export const shippingLabelStatusEnum = pgEnum(
  "shipping_label_status",
  [
    "NOT_GENERATED",
    "GENERATED",
    "PRINTED",
    "VOIDED",
  ],
);

/* ============================================================================
 * Manifest Status
 * ============================================================================
 */

export const manifestStatusEnum = pgEnum("manifest_status", [
  "NOT_CREATED",
  "CREATED",
  "PRINTED",
  "HANDED_OVER",
]);

/* ============================================================================
 * Package Dimension Limits
 * ============================================================================
 */

export const SHIPMENT_DIMENSIONS = {
  MIN_WEIGHT_GRAMS: 1,
  MAX_WEIGHT_GRAMS: 100_000,

  MIN_LENGTH_CM: 1,
  MAX_LENGTH_CM: 300,

  MIN_WIDTH_CM: 1,
  MAX_WIDTH_CM: 300,

  MIN_HEIGHT_CM: 1,
  MAX_HEIGHT_CM: 300,
} as const;

/* ============================================================================
 * Tracking
 * ============================================================================
 */

export const TRACKING = {
  MAX_TRACKING_NUMBER_LENGTH: 100,
  MAX_AWB_NUMBER_LENGTH: 100,
  MAX_MANIFEST_NUMBER_LENGTH: 100,
} as const;

/* ============================================================================
 * URLs
 * ============================================================================
 */

export const SHIPMENT_FILES = {
  MAX_LABEL_URL_LENGTH: 2048,
  MAX_PROOF_OF_DELIVERY_URL_LENGTH: 2048,
} as const;

/* ============================================================================
 * Notes
 * ============================================================================
 */

export const SHIPMENT_NOTES = {
  MAX_INTERNAL_NOTE_LENGTH: 2000,
  MAX_CUSTOMER_NOTE_LENGTH: 1000,
} as const;

/* ============================================================================
 * Defaults
 * ============================================================================
 */

export const DEFAULT_SHIPMENT_METHOD = "STANDARD";
export const DEFAULT_SHIPMENT_STATUS = "PENDING";
export const DEFAULT_PACKAGE_TYPE = "BOX";
export const DEFAULT_DELIVERY_ATTEMPT_STATUS = "NOT_ATTEMPTED";
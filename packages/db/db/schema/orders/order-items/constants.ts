// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-items/constants.ts
// Description: Order Item constants & PostgreSQL enums
// Phase: 6.2.1
// ============================================================================

import { pgEnum } from "drizzle-orm/pg-core";

/* ============================================================================
 * Order Item Status
 * ============================================================================
 *
 * Represents the lifecycle of an individual order item.
 * This is intentionally separate from the parent order status.
 * ========================================================================== */

export const orderItemStatusEnum = pgEnum("order_item_status", [
  "PENDING",
  "CONFIRMED",
  "ALLOCATED",
  "PICKING",
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
  "REFUND_PENDING",
  "REFUNDED",
]);

/* ============================================================================
 * Discount Type
 * ========================================================================== */

export const orderItemDiscountTypeEnum = pgEnum(
  "order_item_discount_type",
  [
    "NONE",
    "FLAT",
    "PERCENTAGE",
  ],
);

/* ============================================================================
 * Tax Type
 * ========================================================================== */

export const orderItemTaxTypeEnum = pgEnum(
  "order_item_tax_type",
  [
    "NONE",
    "GST",
    "IGST",
    "CGST_SGST",
    "VAT",
    "CUSTOM",
  ],
);

/* ============================================================================
 * Fulfillment Type
 * ============================================================================
 *
 * Defines how this individual item will be fulfilled.
 * ========================================================================== */

export const orderItemFulfillmentTypeEnum = pgEnum(
  "order_item_fulfillment_type",
  [
    "STANDARD",
    "EXPRESS",
    "SAME_DAY",
    "STORE_PICKUP",
    "DIGITAL",
    "CUSTOM_MADE",
    "PRE_ORDER",
    "BACK_ORDER",
  ],
);

/* ============================================================================
 * Snapshot Source
 * ============================================================================
 *
 * Indicates where the snapshot originated from.
 * Useful for future catalog migrations or imports.
 * ========================================================================== */

export const orderItemSnapshotSourceEnum = pgEnum(
  "order_item_snapshot_source",
  [
    "PRODUCT",
    "IMPORT",
    "MANUAL",
    "API",
  ],
);

/* ============================================================================
 * Currency
 * ========================================================================== */

export const ORDER_ITEM_DEFAULT_CURRENCY = "INR" as const;

/* ============================================================================
 * Validation
 * ========================================================================== */

export const ORDER_ITEM_MIN_QUANTITY = 1;

export const ORDER_ITEM_MAX_QUANTITY = 9999;

export const ORDER_ITEM_MIN_PRICE = 0;

export const ORDER_ITEM_MAX_PRICE = 99999999;

export const ORDER_ITEM_MAX_PRODUCT_NAME_LENGTH = 255;

export const ORDER_ITEM_MAX_VARIANT_NAME_LENGTH = 255;

export const ORDER_ITEM_MAX_SKU_LENGTH = 120;

export const ORDER_ITEM_MAX_BRAND_LENGTH = 150;

export const ORDER_ITEM_MAX_CATEGORY_LENGTH = 150;

export const ORDER_ITEM_MAX_NOTE_LENGTH = 5000;

/* ============================================================================
 * Decimal Precision
 * ========================================================================== */

export const ORDER_ITEM_PRICE_PRECISION = 12;

export const ORDER_ITEM_PRICE_SCALE = 2;

export const ORDER_ITEM_DIMENSION_PRECISION = 10;

export const ORDER_ITEM_DIMENSION_SCALE = 2;

export const ORDER_ITEM_WEIGHT_PRECISION = 10;

export const ORDER_ITEM_WEIGHT_SCALE = 3;

/* ============================================================================
 * Defaults
 * ========================================================================== */

export const ORDER_ITEM_DEFAULT_STATUS = "PENDING" as const;

export const ORDER_ITEM_DEFAULT_DISCOUNT_TYPE = "NONE" as const;

export const ORDER_ITEM_DEFAULT_TAX_TYPE = "NONE" as const;

export const ORDER_ITEM_DEFAULT_FULFILLMENT_TYPE =
  "STANDARD" as const;

export const ORDER_ITEM_DEFAULT_SNAPSHOT_SOURCE =
  "PRODUCT" as const;

/* ============================================================================
 * Search
 * ========================================================================== */

export const ORDER_ITEM_SEARCHABLE_FIELDS = [
  "productName",
  "variantName",
  "sku",
  "sellerSku",
  "brandName",
  "categoryName",
] as const;

/* ============================================================================
 * Export
 * ========================================================================== */

export const ORDER_ITEM_EXPORTABLE_FIELDS = [
  "productName",
  "variantName",
  "sku",
  "quantity",
  "unitPrice",
  "discountAmount",
  "taxAmount",
  "subtotal",
  "total",
  "itemStatus",
] as const;
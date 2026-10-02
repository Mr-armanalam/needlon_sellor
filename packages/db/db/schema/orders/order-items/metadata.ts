// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-items/metadata.ts
// Description: Order Item module metadata
// Phase: 6.2.2
// ============================================================================

/* ============================================================================
 * Module Information
 * ========================================================================== */

export const ORDER_ITEM_MODULE = "order-items" as const;

export const ORDER_ITEM_MODULE_DISPLAY_NAME = "Order Items" as const;

export const ORDER_ITEM_MODULE_DESCRIPTION =
  "Stores immutable snapshots of purchased products, pricing, inventory, taxes, and fulfillment information for every order item." as const;

export const ORDER_ITEM_MODULE_VERSION = "1.0.0" as const;

/* ============================================================================
 * Database
 * ========================================================================== */

export const ORDER_ITEM_TABLE = "order_items" as const;

export const ORDER_ITEM_PRIMARY_KEY = "id" as const;

export const ORDER_ITEM_DEFAULT_SORT_FIELD = "createdAt" as const;

export const ORDER_ITEM_DEFAULT_SORT_ORDER = "desc" as const;

/* ============================================================================
 * Business
 * ========================================================================== */

export const ORDER_ITEM_DEFAULT_CURRENCY = "INR" as const;

export const ORDER_ITEM_SNAPSHOT_STRATEGY = "IMMUTABLE" as const;

export const ORDER_ITEM_PRICING_STRATEGY = "SNAPSHOT" as const;

export const ORDER_ITEM_INVENTORY_STRATEGY = "SNAPSHOT" as const;

/* ============================================================================
 * Search
 * ========================================================================== */

export const ORDER_ITEM_SEARCHABLE_FIELDS = [
  "productName",
  "variantName",
  "sku",
  "variantSku",
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
  "createdAt",
] as const;

/* ============================================================================
 * Dashboard
 * ========================================================================== */

export const ORDER_ITEM_DEFAULT_PAGE_SIZE = 25;

export const ORDER_ITEM_MAX_PAGE_SIZE = 100;

/* ============================================================================
 * Analytics
 * ========================================================================== */

export const ORDER_ITEM_ANALYTICS_DATE_FIELD =
  "createdAt" as const;

export const ORDER_ITEM_ANALYTICS_VALUE_FIELD =
  "total" as const;

/* ============================================================================
 * Soft Delete
 * ========================================================================== */

export const ORDER_ITEM_SOFT_DELETE_FIELD =
  "deletedAt" as const;

/* ============================================================================
 * Audit
 * ========================================================================== */

export const ORDER_ITEM_CREATED_AT_FIELD =
  "createdAt" as const;

export const ORDER_ITEM_UPDATED_AT_FIELD =
  "updatedAt" as const;

/* ============================================================================
 * Parent Module
 * ========================================================================== */

export const ORDER_ITEM_PARENT_MODULE =
  "orders" as const;

/* ============================================================================
 * Dependencies
 * ========================================================================== */

export const ORDER_ITEM_DEPENDENCIES = [
  "orders",
  "seller",
  "products",
  "product-variants",
] as const;

/* ============================================================================
 * Child Modules
 * ========================================================================== */

export const ORDER_ITEM_CHILD_MODULES = [
  "order-returns",
] as const;

/* ============================================================================
 * Metadata
 * ========================================================================== */

export const ORDER_ITEM_METADATA = {
  module: ORDER_ITEM_MODULE,

  displayName: ORDER_ITEM_MODULE_DISPLAY_NAME,

  description: ORDER_ITEM_MODULE_DESCRIPTION,

  version: ORDER_ITEM_MODULE_VERSION,

  table: ORDER_ITEM_TABLE,

  primaryKey: ORDER_ITEM_PRIMARY_KEY,

  parentModule: ORDER_ITEM_PARENT_MODULE,

  defaultCurrency: ORDER_ITEM_DEFAULT_CURRENCY,

  snapshotStrategy: ORDER_ITEM_SNAPSHOT_STRATEGY,

  pricingStrategy: ORDER_ITEM_PRICING_STRATEGY,

  inventoryStrategy: ORDER_ITEM_INVENTORY_STRATEGY,

  defaultSortField: ORDER_ITEM_DEFAULT_SORT_FIELD,

  defaultSortOrder: ORDER_ITEM_DEFAULT_SORT_ORDER,

  searchableFields: ORDER_ITEM_SEARCHABLE_FIELDS,

  exportableFields: ORDER_ITEM_EXPORTABLE_FIELDS,

  analyticsDateField: ORDER_ITEM_ANALYTICS_DATE_FIELD,

  analyticsValueField: ORDER_ITEM_ANALYTICS_VALUE_FIELD,

  softDeleteField: ORDER_ITEM_SOFT_DELETE_FIELD,

  createdAtField: ORDER_ITEM_CREATED_AT_FIELD,

  updatedAtField: ORDER_ITEM_UPDATED_AT_FIELD,

  dependencies: ORDER_ITEM_DEPENDENCIES,

  childModules: ORDER_ITEM_CHILD_MODULES,
} as const;

/* ============================================================================
 * Types
 * ========================================================================== */

export type OrderItemMetadata =
  typeof ORDER_ITEM_METADATA;
// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/metadata.ts
// Description: Order module metadata
// Phase: 6.1.2
// ============================================================================

/**
 * ============================================================================
 * Module Information
 * ============================================================================
 */

export const ORDER_MODULE = "orders" as const;

export const ORDER_MODULE_DISPLAY_NAME = "Orders" as const;

export const ORDER_MODULE_DESCRIPTION =
  "Manages seller orders, lifecycle, payments, shipments, returns, refunds, and fulfillment." as const;

export const ORDER_MODULE_VERSION = "1.0.0" as const;

/**
 * ============================================================================
 * Database
 * ============================================================================
 */

export const ORDER_TABLE = "orders" as const;

export const ORDER_PRIMARY_KEY = "id" as const;

export const ORDER_DEFAULT_SORT_FIELD = "createdAt" as const;

export const ORDER_DEFAULT_SORT_ORDER = "desc" as const;

/**
 * ============================================================================
 * Business
 * ============================================================================
 */

export const ORDER_NUMBER_PREFIX = "NDLN" as const;

export const ORDER_NUMBER_SEPARATOR = "-" as const;

export const DEFAULT_CURRENCY = "INR" as const;

/**
 * ============================================================================
 * Search Configuration
 * ============================================================================
 */

export const ORDER_SEARCHABLE_FIELDS = [
  "orderNumber",
  "buyerName",
  "buyerEmail",
  "buyerPhone",
] as const;

/**
 * ============================================================================
 * Dashboard
 * ============================================================================
 */

export const ORDER_DEFAULT_PAGE_SIZE = 20;

export const ORDER_MAX_PAGE_SIZE = 100;

/**
 * ============================================================================
 * Export
 * ============================================================================
 */

export const ORDER_EXPORTABLE_FIELDS = [
  "orderNumber",
  "buyerName",
  "status",
  "paymentStatus",
  "paymentMethod",
  "grandTotal",
  "shippingMethod",
  "createdAt",
] as const;

/**
 * ============================================================================
 * Analytics
 * ============================================================================
 */

export const ORDER_ANALYTICS_DATE_FIELD = "createdAt" as const;

/**
 * ============================================================================
 * Soft Delete
 * ============================================================================
 */

export const ORDER_SOFT_DELETE_FIELD = "deletedAt" as const;

/**
 * ============================================================================
 * Audit
 * ============================================================================
 */

export const ORDER_CREATED_AT_FIELD = "createdAt" as const;

export const ORDER_UPDATED_AT_FIELD = "updatedAt" as const;

/**
 * ============================================================================
 * Module Dependencies
 * ============================================================================
 */

export const ORDER_DEPENDENCIES = [
  "seller",
  "store",
  "users",
  "addresses",
] as const;

/**
 * ============================================================================
 * Child Modules
 * ============================================================================
 */

export const ORDER_CHILD_MODULES = [
  "order-items",
  "order-status-history",
  "order-shipments",
  "order-payments",
  "order-returns",
  "order-refunds",
] as const;

/**
 * ============================================================================
 * Metadata
 * ============================================================================
 */

export const ORDER_METADATA = {
  module: ORDER_MODULE,
  displayName: ORDER_MODULE_DISPLAY_NAME,
  description: ORDER_MODULE_DESCRIPTION,
  version: ORDER_MODULE_VERSION,

  table: ORDER_TABLE,
  primaryKey: ORDER_PRIMARY_KEY,

  orderNumberPrefix: ORDER_NUMBER_PREFIX,
  defaultCurrency: DEFAULT_CURRENCY,

  defaultSortField: ORDER_DEFAULT_SORT_FIELD,
  defaultSortOrder: ORDER_DEFAULT_SORT_ORDER,

  searchableFields: ORDER_SEARCHABLE_FIELDS,
  exportableFields: ORDER_EXPORTABLE_FIELDS,

  analyticsDateField: ORDER_ANALYTICS_DATE_FIELD,

  softDeleteField: ORDER_SOFT_DELETE_FIELD,

  createdAtField: ORDER_CREATED_AT_FIELD,
  updatedAtField: ORDER_UPDATED_AT_FIELD,

  dependencies: ORDER_DEPENDENCIES,
  childModules: ORDER_CHILD_MODULES,
} as const;

export type OrderMetadata = typeof ORDER_METADATA;
// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-payments/metadata.ts
// Description: Order Payment module metadata
// Phase: 6.5.2
// ============================================================================

/* ============================================================================
 * Module Information
 * ========================================================================== */

export const ORDER_PAYMENT_MODULE =
  "order-payments" as const;

export const ORDER_PAYMENT_MODULE_DISPLAY_NAME =
  "Order Payments" as const;

export const ORDER_PAYMENT_MODULE_DESCRIPTION =
  "Manages payment lifecycle, payment attempts, payment gateway transactions, refunds, settlements, and financial reconciliation for customer orders." as const;

export const ORDER_PAYMENT_MODULE_VERSION =
  "1.0.0" as const;

/* ============================================================================
 * Database
 * ========================================================================== */

export const ORDER_PAYMENT_TABLE =
  "order_payments" as const;

export const ORDER_PAYMENT_PRIMARY_KEY =
  "id" as const;

export const ORDER_PAYMENT_DEFAULT_SORT_FIELD =
  "createdAt" as const;

export const ORDER_PAYMENT_DEFAULT_SORT_ORDER =
  "desc" as const;

/* ============================================================================
 * Business
 * ========================================================================== */

export const ORDER_PAYMENT_MODE =
  "EVENT_DRIVEN" as const;

export const ORDER_PAYMENT_SUPPORTS_MULTIPLE_PAYMENTS =
  true as const;

export const ORDER_PAYMENT_SUPPORTS_PARTIAL_PAYMENTS =
  true as const;

export const ORDER_PAYMENT_SUPPORTS_MULTIPLE_GATEWAYS =
  true as const;

export const ORDER_PAYMENT_SUPPORTS_REFUNDS =
  true as const;

export const ORDER_PAYMENT_SUPPORTS_PARTIAL_REFUNDS =
  true as const;

export const ORDER_PAYMENT_SUPPORTS_WEBHOOKS =
  true as const;

export const ORDER_PAYMENT_SUPPORTS_RECONCILIATION =
  true as const;

/* ============================================================================
 * Search
 * ========================================================================== */

export const ORDER_PAYMENT_SEARCHABLE_FIELDS = [
  "paymentNumber",
  "transactionId",
  "gatewayPaymentId",
  "gatewayOrderId",
  "gatewayReferenceId",
] as const;

/* ============================================================================
 * Export
 * ========================================================================== */

export const ORDER_PAYMENT_EXPORTABLE_FIELDS = [
  "paymentNumber",
  "paymentStatus",
  "paymentMethod",
  "paymentGateway",
  "transactionId",
  "amount",
  "currency",
  "paidAt",
] as const;

/* ============================================================================
 * Dashboard
 * ========================================================================== */

export const ORDER_PAYMENT_DEFAULT_PAGE_SIZE = 20;

export const ORDER_PAYMENT_MAX_PAGE_SIZE = 100;

/* ============================================================================
 * Analytics
 * ========================================================================== */

export const ORDER_PAYMENT_ANALYTICS_DATE_FIELD =
  "createdAt" as const;

export const ORDER_PAYMENT_ANALYTICS_GROUP_FIELD =
  "paymentStatus" as const;

/* ============================================================================
 * Audit
 * ========================================================================== */

export const ORDER_PAYMENT_CREATED_AT_FIELD =
  "createdAt" as const;

export const ORDER_PAYMENT_UPDATED_AT_FIELD =
  "updatedAt" as const;

export const ORDER_PAYMENT_DELETED_AT_FIELD =
  "deletedAt" as const;

/* ============================================================================
 * Parent Module
 * ========================================================================== */

export const ORDER_PAYMENT_PARENT_MODULE =
  "orders" as const;

/* ============================================================================
 * Dependencies
 * ========================================================================== */

export const ORDER_PAYMENT_DEPENDENCIES = [
  "orders",
  "seller",
  "users",
  "refunds",
] as const;

/* ============================================================================
 * Child Modules
 * ========================================================================== */

export const ORDER_PAYMENT_CHILD_MODULES = [
  "order-refunds",
] as const;

/* ============================================================================
 * Metadata
 * ========================================================================== */

export const ORDER_PAYMENT_METADATA = {
  module: ORDER_PAYMENT_MODULE,

  displayName:
    ORDER_PAYMENT_MODULE_DISPLAY_NAME,

  description:
    ORDER_PAYMENT_MODULE_DESCRIPTION,

  version:
    ORDER_PAYMENT_MODULE_VERSION,

  table:
    ORDER_PAYMENT_TABLE,

  primaryKey:
    ORDER_PAYMENT_PRIMARY_KEY,

  parentModule:
    ORDER_PAYMENT_PARENT_MODULE,

  mode:
    ORDER_PAYMENT_MODE,

  supportsMultiplePayments:
    ORDER_PAYMENT_SUPPORTS_MULTIPLE_PAYMENTS,

  supportsPartialPayments:
    ORDER_PAYMENT_SUPPORTS_PARTIAL_PAYMENTS,

  supportsMultipleGateways:
    ORDER_PAYMENT_SUPPORTS_MULTIPLE_GATEWAYS,

  supportsRefunds:
    ORDER_PAYMENT_SUPPORTS_REFUNDS,

  supportsPartialRefunds:
    ORDER_PAYMENT_SUPPORTS_PARTIAL_REFUNDS,

  supportsWebhooks:
    ORDER_PAYMENT_SUPPORTS_WEBHOOKS,

  supportsReconciliation:
    ORDER_PAYMENT_SUPPORTS_RECONCILIATION,

  defaultSortField:
    ORDER_PAYMENT_DEFAULT_SORT_FIELD,

  defaultSortOrder:
    ORDER_PAYMENT_DEFAULT_SORT_ORDER,

  searchableFields:
    ORDER_PAYMENT_SEARCHABLE_FIELDS,

  exportableFields:
    ORDER_PAYMENT_EXPORTABLE_FIELDS,

  analyticsDateField:
    ORDER_PAYMENT_ANALYTICS_DATE_FIELD,

  analyticsGroupField:
    ORDER_PAYMENT_ANALYTICS_GROUP_FIELD,

  createdAtField:
    ORDER_PAYMENT_CREATED_AT_FIELD,

  updatedAtField:
    ORDER_PAYMENT_UPDATED_AT_FIELD,

  deletedAtField:
    ORDER_PAYMENT_DELETED_AT_FIELD,

  dependencies:
    ORDER_PAYMENT_DEPENDENCIES,

  childModules:
    ORDER_PAYMENT_CHILD_MODULES,
} as const;

/* ============================================================================
 * Types
 * ========================================================================== */

export type OrderPaymentMetadata =
  typeof ORDER_PAYMENT_METADATA;
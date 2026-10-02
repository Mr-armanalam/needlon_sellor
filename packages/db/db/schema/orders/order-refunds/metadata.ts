// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-refunds/metadata.ts
// Description: Order Refund module metadata
// Phase: 6.7.2
// ============================================================================

/* ============================================================================
 * Module Information
 * ========================================================================== */

export const ORDER_REFUND_MODULE =
  "order-refunds" as const;

export const ORDER_REFUND_MODULE_DISPLAY_NAME =
  "Order Refunds" as const;

export const ORDER_REFUND_MODULE_DESCRIPTION =
  "Manages complete refund lifecycle including refund requests, approvals, payment gateway integration, reconciliation, settlements, retries, and financial audit." as const;

export const ORDER_REFUND_MODULE_VERSION =
  "1.0.0" as const;

/* ============================================================================
 * Database
 * ========================================================================== */

export const ORDER_REFUND_TABLE =
  "order_refunds" as const;

export const ORDER_REFUND_PRIMARY_KEY =
  "id" as const;

export const ORDER_REFUND_DEFAULT_SORT_FIELD =
  "createdAt" as const;

export const ORDER_REFUND_DEFAULT_SORT_ORDER =
  "desc" as const;

/* ============================================================================
 * Business Capabilities
 * ========================================================================== */

export const ORDER_REFUND_MODE =
  "EVENT_DRIVEN" as const;

export const ORDER_REFUND_SUPPORTS_FULL_REFUND =
  true as const;

export const ORDER_REFUND_SUPPORTS_PARTIAL_REFUND =
  true as const;

export const ORDER_REFUND_SUPPORTS_MULTIPLE_REFUNDS =
  true as const;

export const ORDER_REFUND_SUPPORTS_GATEWAY_REFUNDS =
  true as const;

export const ORDER_REFUND_SUPPORTS_MANUAL_REFUNDS =
  true as const;

export const ORDER_REFUND_SUPPORTS_STORE_CREDIT =
  true as const;

export const ORDER_REFUND_SUPPORTS_UPI =
  true as const;

export const ORDER_REFUND_SUPPORTS_BANK_TRANSFER =
  true as const;

export const ORDER_REFUND_SUPPORTS_WEBHOOKS =
  true as const;

export const ORDER_REFUND_SUPPORTS_RETRIES =
  true as const;

export const ORDER_REFUND_SUPPORTS_RECONCILIATION =
  true as const;

export const ORDER_REFUND_SUPPORTS_FINANCIAL_AUDIT =
  true as const;

/* ============================================================================
 * Search
 * ========================================================================== */

export const ORDER_REFUND_SEARCHABLE_FIELDS =
  [
    "refundNumber",
    "transactionId",
    "gatewayRefundId",
    "gatewayPaymentId",
    "gatewayReferenceId",
    "failureReason",
  ] as const;

/* ============================================================================
 * Export
 * ========================================================================== */

export const ORDER_REFUND_EXPORTABLE_FIELDS =
  [
    "refundNumber",
    "refundStatus",
    "refundType",
    "refundReason",
    "refundMethod",
    "refundGateway",
    "refundAmount",
    "currency",
    "createdAt",
  ] as const;

/* ============================================================================
 * Dashboard
 * ========================================================================== */

export const ORDER_REFUND_DEFAULT_PAGE_SIZE =
  20;

export const ORDER_REFUND_MAX_PAGE_SIZE =
  100;

/* ============================================================================
 * Analytics
 * ========================================================================== */

export const ORDER_REFUND_ANALYTICS_DATE_FIELD =
  "createdAt" as const;

export const ORDER_REFUND_ANALYTICS_GROUP_FIELD =
  "refundStatus" as const;

/* ============================================================================
 * Audit
 * ========================================================================== */

export const ORDER_REFUND_CREATED_AT_FIELD =
  "createdAt" as const;

export const ORDER_REFUND_UPDATED_AT_FIELD =
  "updatedAt" as const;

export const ORDER_REFUND_DELETED_AT_FIELD =
  "deletedAt" as const;

/* ============================================================================
 * Parent Module
 * ========================================================================== */

export const ORDER_REFUND_PARENT_MODULE =
  "orders" as const;

/* ============================================================================
 * Dependencies
 * ========================================================================== */

export const ORDER_REFUND_DEPENDENCIES =
  [
    "orders",
    "order-returns",
    "order-payments",
    "seller",
    "users",
  ] as const;

/* ============================================================================
 * Child Modules
 * ========================================================================== */

export const ORDER_REFUND_CHILD_MODULES =
  [] as const;

/* ============================================================================
 * Metadata Object
 * ========================================================================== */

export const ORDER_REFUND_METADATA = {
  module:
    ORDER_REFUND_MODULE,

  displayName:
    ORDER_REFUND_MODULE_DISPLAY_NAME,

  description:
    ORDER_REFUND_MODULE_DESCRIPTION,

  version:
    ORDER_REFUND_MODULE_VERSION,

  table:
    ORDER_REFUND_TABLE,

  primaryKey:
    ORDER_REFUND_PRIMARY_KEY,

  parentModule:
    ORDER_REFUND_PARENT_MODULE,

  mode:
    ORDER_REFUND_MODE,

  supportsFullRefund:
    ORDER_REFUND_SUPPORTS_FULL_REFUND,

  supportsPartialRefund:
    ORDER_REFUND_SUPPORTS_PARTIAL_REFUND,

  supportsMultipleRefunds:
    ORDER_REFUND_SUPPORTS_MULTIPLE_REFUNDS,

  supportsGatewayRefunds:
    ORDER_REFUND_SUPPORTS_GATEWAY_REFUNDS,

  supportsManualRefunds:
    ORDER_REFUND_SUPPORTS_MANUAL_REFUNDS,

  supportsStoreCredit:
    ORDER_REFUND_SUPPORTS_STORE_CREDIT,

  supportsUPI:
    ORDER_REFUND_SUPPORTS_UPI,

  supportsBankTransfer:
    ORDER_REFUND_SUPPORTS_BANK_TRANSFER,

  supportsWebhooks:
    ORDER_REFUND_SUPPORTS_WEBHOOKS,

  supportsRetries:
    ORDER_REFUND_SUPPORTS_RETRIES,

  supportsReconciliation:
    ORDER_REFUND_SUPPORTS_RECONCILIATION,

  supportsFinancialAudit:
    ORDER_REFUND_SUPPORTS_FINANCIAL_AUDIT,

  defaultSortField:
    ORDER_REFUND_DEFAULT_SORT_FIELD,

  defaultSortOrder:
    ORDER_REFUND_DEFAULT_SORT_ORDER,

  searchableFields:
    ORDER_REFUND_SEARCHABLE_FIELDS,

  exportableFields:
    ORDER_REFUND_EXPORTABLE_FIELDS,

  analyticsDateField:
    ORDER_REFUND_ANALYTICS_DATE_FIELD,

  analyticsGroupField:
    ORDER_REFUND_ANALYTICS_GROUP_FIELD,

  createdAtField:
    ORDER_REFUND_CREATED_AT_FIELD,

  updatedAtField:
    ORDER_REFUND_UPDATED_AT_FIELD,

  deletedAtField:
    ORDER_REFUND_DELETED_AT_FIELD,

  dependencies:
    ORDER_REFUND_DEPENDENCIES,

  childModules:
    ORDER_REFUND_CHILD_MODULES,
} as const;

/* ============================================================================
 * Types
 * ========================================================================== */

export type OrderRefundMetadata =
  typeof ORDER_REFUND_METADATA;
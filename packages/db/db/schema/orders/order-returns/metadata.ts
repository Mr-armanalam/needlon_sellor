// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-returns/metadata.ts
// Description: Order Return module metadata
// Phase: 6.6.2
// ============================================================================

/* ============================================================================
 * Module Information
 * ========================================================================== */

export const ORDER_RETURN_MODULE =
  "order-returns" as const;

export const ORDER_RETURN_MODULE_DISPLAY_NAME =
  "Order Returns" as const;

export const ORDER_RETURN_MODULE_DESCRIPTION =
  "Manages customer return requests, approvals, pickup, warehouse inspection, replacement, exchange, refunds, and complete return lifecycle." as const;

export const ORDER_RETURN_MODULE_VERSION =
  "1.0.0" as const;

/* ============================================================================
 * Database
 * ========================================================================== */

export const ORDER_RETURN_TABLE =
  "order_returns" as const;

export const ORDER_RETURN_PRIMARY_KEY =
  "id" as const;

export const ORDER_RETURN_DEFAULT_SORT_FIELD =
  "createdAt" as const;

export const ORDER_RETURN_DEFAULT_SORT_ORDER =
  "desc" as const;

/* ============================================================================
 * Business Capabilities
 * ========================================================================== */

export const ORDER_RETURN_MODE =
  "EVENT_DRIVEN" as const;

export const ORDER_RETURN_SUPPORTS_PARTIAL_RETURNS =
  true as const;

export const ORDER_RETURN_SUPPORTS_FULL_RETURNS =
  true as const;

export const ORDER_RETURN_SUPPORTS_REPLACEMENT =
  true as const;

export const ORDER_RETURN_SUPPORTS_EXCHANGE =
  true as const;

export const ORDER_RETURN_SUPPORTS_REFUND =
  true as const;

export const ORDER_RETURN_SUPPORTS_PICKUP =
  true as const;

export const ORDER_RETURN_SUPPORTS_WAREHOUSE_INSPECTION =
  true as const;

export const ORDER_RETURN_SUPPORTS_MULTIPLE_IMAGES =
  true as const;

export const ORDER_RETURN_SUPPORTS_VIDEO_EVIDENCE =
  true as const;

export const ORDER_RETURN_SUPPORTS_ATTACHMENTS =
  true as const;

/* ============================================================================
 * Search
 * ========================================================================== */

export const ORDER_RETURN_SEARCHABLE_FIELDS = [
  "returnNumber",
  "trackingNumber",
  "referenceNumber",
  "customerRemarks",
] as const;

/* ============================================================================
 * Export
 * ========================================================================== */

export const ORDER_RETURN_EXPORTABLE_FIELDS =
  [
    "returnNumber",
    "returnStatus",
    "returnType",
    "returnReason",
    "approvalStatus",
    "pickupStatus",
    "refundStatus",
    "replacementStatus",
    "createdAt",
  ] as const;

/* ============================================================================
 * Dashboard
 * ========================================================================== */

export const ORDER_RETURN_DEFAULT_PAGE_SIZE =
  20;

export const ORDER_RETURN_MAX_PAGE_SIZE =
  100;

/* ============================================================================
 * Analytics
 * ========================================================================== */

export const ORDER_RETURN_ANALYTICS_DATE_FIELD =
  "createdAt" as const;

export const ORDER_RETURN_ANALYTICS_GROUP_FIELD =
  "returnStatus" as const;

/* ============================================================================
 * Audit
 * ========================================================================== */

export const ORDER_RETURN_CREATED_AT_FIELD =
  "createdAt" as const;

export const ORDER_RETURN_UPDATED_AT_FIELD =
  "updatedAt" as const;

export const ORDER_RETURN_DELETED_AT_FIELD =
  "deletedAt" as const;

/* ============================================================================
 * Parent Module
 * ========================================================================== */

export const ORDER_RETURN_PARENT_MODULE =
  "orders" as const;

/* ============================================================================
 * Dependencies
 * ========================================================================== */

export const ORDER_RETURN_DEPENDENCIES =
  [
    "orders",
    "order-items",
    "order-shipments",
    "order-payments",
    "seller",
    "users",
  ] as const;

/* ============================================================================
 * Child Modules
 * ========================================================================== */

export const ORDER_RETURN_CHILD_MODULES =
  [
    "order-refunds",
  ] as const;

/* ============================================================================
 * Metadata Object
 * ========================================================================== */

export const ORDER_RETURN_METADATA = {
  module: ORDER_RETURN_MODULE,

  displayName:
    ORDER_RETURN_MODULE_DISPLAY_NAME,

  description:
    ORDER_RETURN_MODULE_DESCRIPTION,

  version:
    ORDER_RETURN_MODULE_VERSION,

  table:
    ORDER_RETURN_TABLE,

  primaryKey:
    ORDER_RETURN_PRIMARY_KEY,

  parentModule:
    ORDER_RETURN_PARENT_MODULE,

  mode:
    ORDER_RETURN_MODE,

  supportsPartialReturns:
    ORDER_RETURN_SUPPORTS_PARTIAL_RETURNS,

  supportsFullReturns:
    ORDER_RETURN_SUPPORTS_FULL_RETURNS,

  supportsReplacement:
    ORDER_RETURN_SUPPORTS_REPLACEMENT,

  supportsExchange:
    ORDER_RETURN_SUPPORTS_EXCHANGE,

  supportsRefund:
    ORDER_RETURN_SUPPORTS_REFUND,

  supportsPickup:
    ORDER_RETURN_SUPPORTS_PICKUP,

  supportsWarehouseInspection:
    ORDER_RETURN_SUPPORTS_WAREHOUSE_INSPECTION,

  supportsMultipleImages:
    ORDER_RETURN_SUPPORTS_MULTIPLE_IMAGES,

  supportsVideoEvidence:
    ORDER_RETURN_SUPPORTS_VIDEO_EVIDENCE,

  supportsAttachments:
    ORDER_RETURN_SUPPORTS_ATTACHMENTS,

  defaultSortField:
    ORDER_RETURN_DEFAULT_SORT_FIELD,

  defaultSortOrder:
    ORDER_RETURN_DEFAULT_SORT_ORDER,

  searchableFields:
    ORDER_RETURN_SEARCHABLE_FIELDS,

  exportableFields:
    ORDER_RETURN_EXPORTABLE_FIELDS,

  analyticsDateField:
    ORDER_RETURN_ANALYTICS_DATE_FIELD,

  analyticsGroupField:
    ORDER_RETURN_ANALYTICS_GROUP_FIELD,

  createdAtField:
    ORDER_RETURN_CREATED_AT_FIELD,

  updatedAtField:
    ORDER_RETURN_UPDATED_AT_FIELD,

  deletedAtField:
    ORDER_RETURN_DELETED_AT_FIELD,

  dependencies:
    ORDER_RETURN_DEPENDENCIES,

  childModules:
    ORDER_RETURN_CHILD_MODULES,
} as const;

/* ============================================================================
 * Types
 * ========================================================================== */

export type OrderReturnMetadata =
  typeof ORDER_RETURN_METADATA;
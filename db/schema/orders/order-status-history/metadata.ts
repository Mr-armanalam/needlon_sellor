// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-status-history/metadata.ts
// Description: Order Status History module metadata
// Phase: 6.3.2
// ============================================================================

/* ============================================================================
 * Module Information
 * ========================================================================== */

export const ORDER_STATUS_HISTORY_MODULE =
  "order-status-history" as const;

export const ORDER_STATUS_HISTORY_MODULE_DISPLAY_NAME =
  "Order Status History" as const;

export const ORDER_STATUS_HISTORY_MODULE_DESCRIPTION =
  "Maintains an immutable audit trail of every order status transition, including the actor, source, timestamps, and transition details." as const;

export const ORDER_STATUS_HISTORY_MODULE_VERSION =
  "1.0.0" as const;

/* ============================================================================
 * Database
 * ========================================================================== */

export const ORDER_STATUS_HISTORY_TABLE =
  "order_status_history" as const;

export const ORDER_STATUS_HISTORY_PRIMARY_KEY =
  "id" as const;

export const ORDER_STATUS_HISTORY_DEFAULT_SORT_FIELD =
  "changedAt" as const;

export const ORDER_STATUS_HISTORY_DEFAULT_SORT_ORDER =
  "desc" as const;

/* ============================================================================
 * Business
 * ========================================================================== */

export const ORDER_STATUS_HISTORY_MODE =
  "APPEND_ONLY" as const;

export const ORDER_STATUS_HISTORY_RETENTION_POLICY =
  "PERMANENT" as const;

export const ORDER_STATUS_HISTORY_IMMUTABLE =
  true as const;

/* ============================================================================
 * Search
 * ========================================================================== */

export const ORDER_STATUS_HISTORY_SEARCHABLE_FIELDS = [
  "reason",
  "remarks",
  "referenceId",
  "fromStatus",
  "toStatus",
] as const;

/* ============================================================================
 * Export
 * ========================================================================== */

export const ORDER_STATUS_HISTORY_EXPORTABLE_FIELDS = [
  "fromStatus",
  "toStatus",
  "action",
  "source",
  "result",
  "reason",
  "remarks",
  "changedAt",
] as const;

/* ============================================================================
 * Dashboard
 * ========================================================================== */

export const ORDER_STATUS_HISTORY_DEFAULT_PAGE_SIZE = 50;

export const ORDER_STATUS_HISTORY_MAX_PAGE_SIZE = 200;

/* ============================================================================
 * Analytics
 * ========================================================================== */

export const ORDER_STATUS_HISTORY_ANALYTICS_DATE_FIELD =
  "changedAt" as const;

export const ORDER_STATUS_HISTORY_ANALYTICS_GROUP_FIELD =
  "toStatus" as const;

/* ============================================================================
 * Audit
 * ========================================================================== */

export const ORDER_STATUS_HISTORY_CREATED_AT_FIELD =
  "createdAt" as const;

export const ORDER_STATUS_HISTORY_CHANGED_AT_FIELD =
  "changedAt" as const;

/* ============================================================================
 * Parent Module
 * ========================================================================== */

export const ORDER_STATUS_HISTORY_PARENT_MODULE =
  "orders" as const;

/* ============================================================================
 * Dependencies
 * ========================================================================== */

export const ORDER_STATUS_HISTORY_DEPENDENCIES = [
  "orders",
  "seller",
  "users",
] as const;

/* ============================================================================
 * Child Modules
 * ========================================================================== */

export const ORDER_STATUS_HISTORY_CHILD_MODULES =
  [] as const;

/* ============================================================================
 * Metadata
 * ========================================================================== */

export const ORDER_STATUS_HISTORY_METADATA = {
  module: ORDER_STATUS_HISTORY_MODULE,

  displayName: ORDER_STATUS_HISTORY_MODULE_DISPLAY_NAME,

  description: ORDER_STATUS_HISTORY_MODULE_DESCRIPTION,

  version: ORDER_STATUS_HISTORY_MODULE_VERSION,

  table: ORDER_STATUS_HISTORY_TABLE,

  primaryKey: ORDER_STATUS_HISTORY_PRIMARY_KEY,

  parentModule: ORDER_STATUS_HISTORY_PARENT_MODULE,

  mode: ORDER_STATUS_HISTORY_MODE,

  retentionPolicy:
    ORDER_STATUS_HISTORY_RETENTION_POLICY,

  immutable: ORDER_STATUS_HISTORY_IMMUTABLE,

  defaultSortField:
    ORDER_STATUS_HISTORY_DEFAULT_SORT_FIELD,

  defaultSortOrder:
    ORDER_STATUS_HISTORY_DEFAULT_SORT_ORDER,

  searchableFields:
    ORDER_STATUS_HISTORY_SEARCHABLE_FIELDS,

  exportableFields:
    ORDER_STATUS_HISTORY_EXPORTABLE_FIELDS,

  analyticsDateField:
    ORDER_STATUS_HISTORY_ANALYTICS_DATE_FIELD,

  analyticsGroupField:
    ORDER_STATUS_HISTORY_ANALYTICS_GROUP_FIELD,

  createdAtField:
    ORDER_STATUS_HISTORY_CREATED_AT_FIELD,

  changedAtField:
    ORDER_STATUS_HISTORY_CHANGED_AT_FIELD,

  dependencies:
    ORDER_STATUS_HISTORY_DEPENDENCIES,

  childModules:
    ORDER_STATUS_HISTORY_CHILD_MODULES,
} as const;

/* ============================================================================
 * Types
 * ========================================================================== */

export type OrderStatusHistoryMetadata =
  typeof ORDER_STATUS_HISTORY_METADATA;
// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-shipments/metadata.ts
// Description: Order Shipment module metadata
// Phase: 6.4.2
// ============================================================================

/* ============================================================================
 * Module Information
 * ========================================================================== */

export const ORDER_SHIPMENT_MODULE =
  "order-shipments" as const;

export const ORDER_SHIPMENT_MODULE_DISPLAY_NAME =
  "Order Shipments" as const;

export const ORDER_SHIPMENT_MODULE_DESCRIPTION =
  "Manages shipment lifecycle, courier information, tracking events, delivery milestones, and shipment metadata for customer orders." as const;

export const ORDER_SHIPMENT_MODULE_VERSION =
  "1.0.0" as const;

/* ============================================================================
 * Database
 * ========================================================================== */

export const ORDER_SHIPMENT_TABLE =
  "order_shipments" as const;

export const ORDER_SHIPMENT_PRIMARY_KEY =
  "id" as const;

export const ORDER_SHIPMENT_DEFAULT_SORT_FIELD =
  "createdAt" as const;

export const ORDER_SHIPMENT_DEFAULT_SORT_ORDER =
  "desc" as const;

/* ============================================================================
 * Business
 * ========================================================================== */

export const ORDER_SHIPMENT_MODE =
  "EVENT_DRIVEN" as const;

export const ORDER_SHIPMENT_SUPPORTS_SPLIT_SHIPMENTS =
  true as const;

export const ORDER_SHIPMENT_SUPPORTS_PARTIAL_DELIVERY =
  true as const;

export const ORDER_SHIPMENT_TRACKING_ENABLED =
  true as const;

/* ============================================================================
 * Search
 * ========================================================================== */

export const ORDER_SHIPMENT_SEARCHABLE_FIELDS = [
  "shipmentNumber",
  "trackingNumber",
  "carrierName",
  "trackingUrl",
] as const;

/* ============================================================================
 * Export
 * ========================================================================== */

export const ORDER_SHIPMENT_EXPORTABLE_FIELDS = [
  "shipmentNumber",
  "trackingNumber",
  "carrierName",
  "shipmentStatus",
  "shippingMethod",
  "dispatchedAt",
  "deliveredAt",
] as const;

/* ============================================================================
 * Dashboard
 * ========================================================================== */

export const ORDER_SHIPMENT_DEFAULT_PAGE_SIZE = 20;

export const ORDER_SHIPMENT_MAX_PAGE_SIZE = 100;

/* ============================================================================
 * Analytics
 * ========================================================================== */

export const ORDER_SHIPMENT_ANALYTICS_DATE_FIELD =
  "createdAt" as const;

export const ORDER_SHIPMENT_ANALYTICS_GROUP_FIELD =
  "shipmentStatus" as const;

/* ============================================================================
 * Audit
 * ========================================================================== */

export const ORDER_SHIPMENT_CREATED_AT_FIELD =
  "createdAt" as const;

export const ORDER_SHIPMENT_UPDATED_AT_FIELD =
  "updatedAt" as const;

export const ORDER_SHIPMENT_DELETED_AT_FIELD =
  "deletedAt" as const;

/* ============================================================================
 * Parent Module
 * ========================================================================== */

export const ORDER_SHIPMENT_PARENT_MODULE =
  "orders" as const;

/* ============================================================================
 * Dependencies
 * ========================================================================== */

export const ORDER_SHIPMENT_DEPENDENCIES = [
  "orders",
  "seller",
  "order-items",
] as const;

/* ============================================================================
 * Child Modules
 * ========================================================================== */

export const ORDER_SHIPMENT_CHILD_MODULES = [] as const;

/* ============================================================================
 * Metadata
 * ========================================================================== */

export const ORDER_SHIPMENT_METADATA = {
  module: ORDER_SHIPMENT_MODULE,

  displayName: ORDER_SHIPMENT_MODULE_DISPLAY_NAME,

  description: ORDER_SHIPMENT_MODULE_DESCRIPTION,

  version: ORDER_SHIPMENT_MODULE_VERSION,

  table: ORDER_SHIPMENT_TABLE,

  primaryKey: ORDER_SHIPMENT_PRIMARY_KEY,

  parentModule: ORDER_SHIPMENT_PARENT_MODULE,

  mode: ORDER_SHIPMENT_MODE,

  supportsSplitShipments:
    ORDER_SHIPMENT_SUPPORTS_SPLIT_SHIPMENTS,

  supportsPartialDelivery:
    ORDER_SHIPMENT_SUPPORTS_PARTIAL_DELIVERY,

  trackingEnabled:
    ORDER_SHIPMENT_TRACKING_ENABLED,

  defaultSortField:
    ORDER_SHIPMENT_DEFAULT_SORT_FIELD,

  defaultSortOrder:
    ORDER_SHIPMENT_DEFAULT_SORT_ORDER,

  searchableFields:
    ORDER_SHIPMENT_SEARCHABLE_FIELDS,

  exportableFields:
    ORDER_SHIPMENT_EXPORTABLE_FIELDS,

  analyticsDateField:
    ORDER_SHIPMENT_ANALYTICS_DATE_FIELD,

  analyticsGroupField:
    ORDER_SHIPMENT_ANALYTICS_GROUP_FIELD,

  createdAtField:
    ORDER_SHIPMENT_CREATED_AT_FIELD,

  updatedAtField:
    ORDER_SHIPMENT_UPDATED_AT_FIELD,

  deletedAtField:
    ORDER_SHIPMENT_DELETED_AT_FIELD,

  dependencies:
    ORDER_SHIPMENT_DEPENDENCIES,

  childModules:
    ORDER_SHIPMENT_CHILD_MODULES,
} as const;

/* ============================================================================
 * Types
 * ========================================================================== */

export type OrderShipmentMetadata =
  typeof ORDER_SHIPMENT_METADATA;
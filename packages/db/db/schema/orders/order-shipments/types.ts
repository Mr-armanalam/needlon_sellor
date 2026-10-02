// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-shipments/types.ts
// Description: Shared Order Shipment types
// Phase: 6.4.3
// ============================================================================

import {
  courierPartnerEnum,
  shipmentMethodEnum,
  shipmentStatusEnum,
} from "./constants";
/* ============================================================================
 * Enum Types
 * ========================================================================== */

export type OrderShipmentStatus =
  (typeof shipmentStatusEnum.enumValues)[number];

export type OrderShipmentMethod =
  (typeof shipmentMethodEnum.enumValues)[number];

export type OrderShipmentCarrier =
  (typeof courierPartnerEnum.enumValues)[number];

/* ============================================================================
 * Identity
 * ========================================================================== */

export interface OrderShipmentIdentity {
  id: string;

  orderId: string;

  sellerId: string;
}

/* ============================================================================
 * Shipment Information
 * ========================================================================== */

export interface OrderShipmentInformation {
  shipmentNumber: string;

  shipmentStatus: OrderShipmentStatus;

  shippingMethod: OrderShipmentMethod;

  carrier: OrderShipmentCarrier;

  carrierName: string | null;

  trackingNumber: string | null;

  trackingUrl: string | null;

  referenceNumber: string | null;
}

/* ============================================================================
 * Logistics
 * ========================================================================== */

export interface OrderShipmentLogistics {
  packageCount: number;

  totalWeight: string | null;

  length: string | null;

  width: string | null;

  height: string | null;
}

/* ============================================================================
 * Shipment Timeline
 * ========================================================================== */

export interface OrderShipmentTimeline {
  packedAt: Date | null;

  dispatchedAt: Date | null;

  inTransitAt: Date | null;

  outForDeliveryAt: Date | null;

  deliveredAt: Date | null;

  failedAt: Date | null;

  returnedAt: Date | null;

  cancelledAt: Date | null;
}

/* ============================================================================
 * Shipment Metadata
 * ========================================================================== */

export interface OrderShipmentMetadata {
  notes: string | null;

  internalNotes: string | null;

  estimatedDeliveryDate: Date | null;

  actualDeliveryDate: Date | null;
}

/* ============================================================================
 * Audit
 * ========================================================================== */

export interface OrderShipmentAudit {
  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
}

/* ============================================================================
 * Aggregate
 * ========================================================================== */

export interface OrderShipment
  extends OrderShipmentIdentity,
    OrderShipmentInformation,
    OrderShipmentLogistics,
    OrderShipmentTimeline,
    OrderShipmentMetadata,
    OrderShipmentAudit {}

/* ============================================================================
 * DTOs
 * ========================================================================== */

export interface CreateOrderShipmentInput {
  orderId: string;

  sellerId: string;

  shipmentNumber: string;

  shipmentStatus?: OrderShipmentStatus;

  shippingMethod: OrderShipmentMethod;

  carrier: OrderShipmentCarrier;

  carrierName?: string | null;

  trackingNumber?: string | null;

  trackingUrl?: string | null;

  referenceNumber?: string | null;

  packageCount?: number;

  totalWeight?: string | null;

  length?: string | null;

  width?: string | null;

  height?: string | null;

  estimatedDeliveryDate?: Date | null;

  notes?: string | null;

  internalNotes?: string | null;
}

export interface UpdateOrderShipmentInput {
  shipmentStatus?: OrderShipmentStatus;

  carrierName?: string | null;

  trackingNumber?: string | null;

  trackingUrl?: string | null;

  referenceNumber?: string | null;

  packageCount?: number;

  totalWeight?: string | null;

  length?: string |null;

  width?: string | null;

  height?: string | null;

  packedAt?: Date | null;

  dispatchedAt?: Date | null;

  inTransitAt?: Date | null;

  outForDeliveryAt?: Date | null;

  deliveredAt?: Date | null;

  failedAt?: Date | null;

  returnedAt?: Date | null;

  cancelledAt?: Date | null;

  estimatedDeliveryDate?: Date | null;

  actualDeliveryDate?: Date | null;

  notes?: string | null;

  internalNotes?: string | null;
}

/* ============================================================================
 * Tracking
 * ========================================================================== */

export interface ShipmentTrackingSummary {
  shipmentNumber: string;

  shipmentStatus: OrderShipmentStatus;

  trackingNumber: string | null;

  trackingUrl: string | null;

  carrier: OrderShipmentCarrier;

  carrierName: string | null;

  estimatedDeliveryDate: Date | null;

  actualDeliveryDate: Date | null;
}

/* ============================================================================
 * Dashboard
 * ========================================================================== */

export interface ShipmentDashboardSummary {
  totalShipments: number;

  pendingShipments: number;

  dispatchedShipments: number;

  inTransitShipments: number;

  deliveredShipments: number;

  failedShipments: number;

  returnedShipments: number;
}

/* ============================================================================
 * Search Filters
 * ========================================================================== */

export interface OrderShipmentSearchFilter {
  orderId?: string;

  sellerId?: string;

  shipmentStatus?: OrderShipmentStatus;

  shippingMethod?: OrderShipmentMethod;

  carrier?: OrderShipmentCarrier;

  trackingNumber?: string;

  shipmentNumber?: string;

  fromDate?: Date;

  toDate?: Date;

  search?: string;

  page?: number;

  limit?: number;
}
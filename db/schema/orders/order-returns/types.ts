// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-returns/types.ts
// Description: Shared Order Return types
// Phase: 6.6.3
// ============================================================================

import type {
  orderReturnApprovalStatusEnum,
  orderReturnConditionEnum,
  orderReturnInspectionResultEnum,
  orderReturnPickupStatusEnum,
  orderReturnReasonEnum,
  orderReturnRefundStatusEnum,
  orderReturnReplacementStatusEnum,
  orderReturnStatusEnum,
  orderReturnTypeEnum,
} from "./constants";

/* ============================================================================
 * Enum Types
 * ========================================================================== */

export type OrderReturnStatus =
  (typeof orderReturnStatusEnum.enumValues)[number];

export type OrderReturnType =
  (typeof orderReturnTypeEnum.enumValues)[number];

export type OrderReturnReason =
  (typeof orderReturnReasonEnum.enumValues)[number];

export type OrderReturnApprovalStatus =
  (typeof orderReturnApprovalStatusEnum.enumValues)[number];

export type OrderReturnCondition =
  (typeof orderReturnConditionEnum.enumValues)[number];

export type OrderReturnPickupStatus =
  (typeof orderReturnPickupStatusEnum.enumValues)[number];

export type OrderReturnInspectionResult =
  (typeof orderReturnInspectionResultEnum.enumValues)[number];

export type OrderReturnRefundStatus =
  (typeof orderReturnRefundStatusEnum.enumValues)[number];

export type OrderReturnReplacementStatus =
  (typeof orderReturnReplacementStatusEnum.enumValues)[number];

/* ============================================================================
 * Identity
 * ========================================================================== */

export interface OrderReturnIdentity {
  id: string;

  orderId: string;

  orderItemId: string | null;

  shipmentId: string | null;

  paymentId: string | null;

  sellerId: string;
}

/* ============================================================================
 * Return Information
 * ========================================================================== */

export interface OrderReturnInformation {
  returnNumber: string;

  returnStatus: OrderReturnStatus;

  returnType: OrderReturnType;

  returnReason: OrderReturnReason;

  approvalStatus: OrderReturnApprovalStatus;

  refundStatus: OrderReturnRefundStatus;

  replacementStatus: OrderReturnReplacementStatus;
}

/* ============================================================================
 * Customer Request
 * ========================================================================== */

export interface OrderReturnCustomerRequest {
  customerRemarks: string | null;

  sellerRemarks: string | null;

  adminRemarks: string | null;
}

/* ============================================================================
 * Pickup
 * ========================================================================== */

export interface OrderReturnPickup {
  pickupStatus: OrderReturnPickupStatus;

  pickupAddress: string | null;

  pickupTrackingNumber: string | null;

  pickupReferenceNumber: string | null;

  pickupScheduledAt: Date | null;

  pickedUpAt: Date | null;
}

/* ============================================================================
 * Warehouse Inspection
 * ========================================================================== */

export interface OrderReturnInspection {
  inspectionResult: OrderReturnInspectionResult;

  returnCondition: OrderReturnCondition;

  inspectionNotes: string | null;

  inspectedAt: Date | null;
}

/* ============================================================================
 * Refund / Replacement
 * ========================================================================== */

export interface OrderReturnResolution {
  refundAmount: string | null;

  replacementOrderId: string | null;

  replacementShipmentId: string | null;
}

/* ============================================================================
 * Timeline
 * ========================================================================== */

export interface OrderReturnTimeline {
  requestedAt: Date;

  approvedAt: Date | null;

  rejectedAt: Date | null;

  receivedAt: Date | null;

  completedAt: Date | null;

  cancelledAt: Date | null;
}

/* ============================================================================
 * Evidence
 * ========================================================================== */

export interface OrderReturnEvidence {
  imageUrls: string[] | null;

  videoUrls: string[] | null;

  attachmentUrls: string[] | null;
}

/* ============================================================================
 * Metadata
 * ========================================================================== */

export interface OrderReturnMetadata {
  internalNotes: string | null;
}

/* ============================================================================
 * Audit
 * ========================================================================== */

export interface OrderReturnAudit {
  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
}

/* ============================================================================
 * Aggregate
 * ========================================================================== */

export interface OrderReturn
  extends OrderReturnIdentity,
    OrderReturnInformation,
    OrderReturnCustomerRequest,
    OrderReturnPickup,
    OrderReturnInspection,
    OrderReturnResolution,
    OrderReturnTimeline,
    OrderReturnEvidence,
    OrderReturnMetadata,
    OrderReturnAudit {}

/* ============================================================================
 * Create DTO
 * ========================================================================== */

export interface CreateOrderReturnInput {
  orderId: string;

  sellerId: string;

  orderItemId?: string;

  shipmentId?: string;

  paymentId?: string;

  returnType: OrderReturnType;

  returnReason: OrderReturnReason;

  customerRemarks?: string;

  imageUrls?: string[];

  videoUrls?: string[];

  attachmentUrls?: string[];
}

/* ============================================================================
 * Update DTO
 * ========================================================================== */

export interface UpdateOrderReturnInput {
  returnStatus?: OrderReturnStatus;

  approvalStatus?: OrderReturnApprovalStatus;

  refundStatus?: OrderReturnRefundStatus;

  replacementStatus?: OrderReturnReplacementStatus;

  pickupStatus?: OrderReturnPickupStatus;

  inspectionResult?: OrderReturnInspectionResult;

  returnCondition?: OrderReturnCondition;

  sellerRemarks?: string;

  adminRemarks?: string;

  inspectionNotes?: string;

  pickupAddress?: string;

  pickupTrackingNumber?: string;

  pickupReferenceNumber?: string;

  refundAmount?: string;

  replacementOrderId?: string;

  replacementShipmentId?: string;

  approvedAt?: Date;

  rejectedAt?: Date;

  pickupScheduledAt?: Date;

  pickedUpAt?: Date;

  receivedAt?: Date;

  inspectedAt?: Date;

  completedAt?: Date;

  cancelledAt?: Date;

  internalNotes?: string;
}

/* ============================================================================
 * Summary
 * ========================================================================== */

export interface OrderReturnSummary {
  returnNumber: string;

  returnStatus: OrderReturnStatus;

  returnType: OrderReturnType;

  refundStatus: OrderReturnRefundStatus;

  replacementStatus: OrderReturnReplacementStatus;

  requestedAt: Date;
}

/* ============================================================================
 * Dashboard
 * ========================================================================== */

export interface OrderReturnDashboardSummary {
  totalReturns: number;

  pendingReturns: number;

  approvedReturns: number;

  rejectedReturns: number;

  refundedReturns: number;

  replacedReturns: number;

  completedReturns: number;
}

/* ============================================================================
 * Search
 * ========================================================================== */

export interface OrderReturnSearchFilter {
  orderId?: string;

  sellerId?: string;

  orderItemId?: string;

  shipmentId?: string;

  paymentId?: string;

  returnStatus?: OrderReturnStatus;

  returnType?: OrderReturnType;

  returnReason?: OrderReturnReason;

  approvalStatus?: OrderReturnApprovalStatus;

  refundStatus?: OrderReturnRefundStatus;

  replacementStatus?: OrderReturnReplacementStatus;

  pickupStatus?: OrderReturnPickupStatus;

  inspectionResult?: OrderReturnInspectionResult;

  search?: string;

  fromDate?: Date;

  toDate?: Date;

  page?: number;

  limit?: number;
}
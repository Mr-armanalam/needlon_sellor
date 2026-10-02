// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-refunds/types.ts
// Description: Shared Order Refund types
// Phase: 6.7.3
// ============================================================================

import type {
  orderRefundApprovalStatusEnum,
  orderRefundGatewayEnum,
  orderRefundMethodEnum,
  orderRefundReasonEnum,
  orderRefundStatusEnum,
  orderRefundTypeEnum,
} from "./constants";

/* ============================================================================
 * Enum Types
 * ========================================================================== */

export type OrderRefundStatus =
  (typeof orderRefundStatusEnum.enumValues)[number];

export type OrderRefundType =
  (typeof orderRefundTypeEnum.enumValues)[number];

export type OrderRefundReason =
  (typeof orderRefundReasonEnum.enumValues)[number];

export type OrderRefundMethod =
  (typeof orderRefundMethodEnum.enumValues)[number];

export type OrderRefundGateway =
  (typeof orderRefundGatewayEnum.enumValues)[number];

export type OrderRefundApprovalStatus =
  (typeof orderRefundApprovalStatusEnum.enumValues)[number];

/* ============================================================================
 * Identity
 * ========================================================================== */

export interface OrderRefundIdentity {
  id: string;

  refundNumber: string;

  orderId: string;

  orderReturnId: string | null;

  paymentId: string | null;

  sellerId: string;
}

/* ============================================================================
 * Refund Information
 * ========================================================================== */

export interface OrderRefundInformation {
  refundStatus: OrderRefundStatus;

  refundType: OrderRefundType;

  refundReason: OrderRefundReason;

  approvalStatus: OrderRefundApprovalStatus;

  refundMethod: OrderRefundMethod;

  refundGateway: OrderRefundGateway;
}

/* ============================================================================
 * Financial Information
 * ========================================================================== */

export interface OrderRefundFinancial {
  refundAmount: string;

  currency: string;

  exchangeRate: string | null;

  gatewayFee: string | null;

  processingFee: string | null;

  taxAmount: string | null;

  netRefundAmount: string | null;
}

/* ============================================================================
 * Gateway Information
 * ========================================================================== */

export interface OrderRefundGatewayInformation {
  transactionId: string | null;

  gatewayPaymentId: string | null;

  gatewayRefundId: string | null;

  gatewayReferenceId: string | null;

  gatewayResponse: Record<string, unknown> | null;
}

/* ============================================================================
 * Retry Information
 * ========================================================================== */

export interface OrderRefundRetry {
  retryCount: number;

  maxRetryCount: number;

  nextRetryAt: Date | null;

  lastRetryAt: Date | null;

  failureReason: string | null;
}

/* ============================================================================
 * Approval
 * ========================================================================== */

export interface OrderRefundApproval {
  approvedBy: string | null;

  approvalRemarks: string | null;
}

/* ============================================================================
 * Timeline
 * ========================================================================== */

export interface OrderRefundTimeline {
  initiatedAt: Date | null;

  approvedAt: Date | null;

  processedAt: Date | null;

  completedAt: Date | null;

  failedAt: Date | null;

  cancelledAt: Date | null;
}

/* ============================================================================
 * Webhooks
 * ========================================================================== */

export interface OrderRefundWebhook {
  webhookReceivedAt: Date | null;

  webhookPayload: Record<
    string,
    unknown
  > | null;
}

/* ============================================================================
 * Metadata
 * ========================================================================== */

export interface OrderRefundMetadata {
  internalNotes: string | null;
}

/* ============================================================================
 * Audit
 * ========================================================================== */

export interface OrderRefundAudit {
  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
}

/* ============================================================================
 * Aggregate
 * ========================================================================== */

export interface OrderRefund
  extends OrderRefundIdentity,
    OrderRefundInformation,
    OrderRefundFinancial,
    OrderRefundGatewayInformation,
    OrderRefundRetry,
    OrderRefundApproval,
    OrderRefundTimeline,
    OrderRefundWebhook,
    OrderRefundMetadata,
    OrderRefundAudit {}

/* ============================================================================
 * Create DTO
 * ========================================================================== */

export interface CreateOrderRefundInput {
  orderId: string;

  sellerId: string;

  refundAmount: string;

  refundType: OrderRefundType;

  refundReason: OrderRefundReason;

  refundMethod: OrderRefundMethod;

  paymentId?: string;

  orderReturnId?: string;

  currency?: string;

  internalNotes?: string;
}

/* ============================================================================
 * Update DTO
 * ========================================================================== */

export interface UpdateOrderRefundInput {
  refundStatus?: OrderRefundStatus;

  approvalStatus?: OrderRefundApprovalStatus;

  refundMethod?: OrderRefundMethod;

  refundGateway?: OrderRefundGateway;

  transactionId?: string;

  gatewayPaymentId?: string;

  gatewayRefundId?: string;

  gatewayReferenceId?: string;

  gatewayResponse?: Record<
    string,
    unknown
  >;

  retryCount?: number;

  nextRetryAt?: Date;

  lastRetryAt?: Date;

  failureReason?: string;

  approvedBy?: string;

  approvalRemarks?: string;

  gatewayFee?: string;

  processingFee?: string;

  taxAmount?: string;

  netRefundAmount?: string;

  exchangeRate?: string;

  initiatedAt?: Date;

  approvedAt?: Date;

  processedAt?: Date;

  completedAt?: Date;

  failedAt?: Date;

  cancelledAt?: Date;

  webhookReceivedAt?: Date;

  webhookPayload?: Record<
    string,
    unknown
  >;

  internalNotes?: string;
}

/* ============================================================================
 * Summary
 * ========================================================================== */

export interface OrderRefundSummary {
  refundNumber: string;

  refundStatus: OrderRefundStatus;

  refundAmount: string;

  refundMethod: OrderRefundMethod;

  refundGateway: OrderRefundGateway;

  completedAt: Date | null;
}

/* ============================================================================
 * Dashboard
 * ========================================================================== */

export interface OrderRefundDashboardSummary {
  totalRefunds: number;

  pendingRefunds: number;

  processingRefunds: number;

  successfulRefunds: number;

  failedRefunds: number;

  cancelledRefunds: number;

  totalRefundAmount: string;
}

/* ============================================================================
 * Search
 * ========================================================================== */

export interface OrderRefundSearchFilter {
  orderId?: string;

  sellerId?: string;

  paymentId?: string;

  orderReturnId?: string;

  refundStatus?: OrderRefundStatus;

  refundType?: OrderRefundType;

  refundReason?: OrderRefundReason;

  approvalStatus?: OrderRefundApprovalStatus;

  refundMethod?: OrderRefundMethod;

  refundGateway?: OrderRefundGateway;

  search?: string;

  fromDate?: Date;

  toDate?: Date;

  page?: number;

  limit?: number;
}
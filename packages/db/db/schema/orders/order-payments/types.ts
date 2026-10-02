// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-payments/types.ts
// Description: Shared Order Payment types
// Phase: 6.5.3
// ============================================================================

import type {
  paymentGatewayEnum,
  paymentModeEnum,
  settlementStatusEnum,
} from "./constants";

/* ============================================================================
 * Enum Types
 * ========================================================================== */

export type OrderPaymentStatus =
  (typeof settlementStatusEnum.enumValues)[number];

export type OrderPaymentMethod =
  (typeof paymentModeEnum.enumValues)[number];

export type OrderPaymentGateway =
  (typeof paymentGatewayEnum.enumValues)[number];

/* ============================================================================
 * Identity
 * ========================================================================== */

export interface OrderPaymentIdentity {
  id: string;

  orderId: string;

  sellerId: string;
}

/* ============================================================================
 * Payment Information
 * ========================================================================== */

export interface OrderPaymentInformation {
  paymentNumber: string;

  paymentStatus: OrderPaymentStatus;

  paymentMethod: OrderPaymentMethod;

  paymentGateway: OrderPaymentGateway;

  currency: string;

  amount: string;

  gatewayFee: string | null;

  platformFee: string | null;

  taxAmount: string | null;

  netAmount: string | null;
}

/* ============================================================================
 * Gateway Information
 * ========================================================================== */

export interface OrderPaymentGatewayInformation {
  transactionId: string | null;

  gatewayPaymentId: string | null;

  gatewayOrderId: string | null;

  gatewayReferenceId: string | null;

  gatewaySignature: string | null;
}

/* ============================================================================
 * Payment Timeline
 * ========================================================================== */

export interface OrderPaymentTimeline {
  initiatedAt: Date | null;

  authorizedAt: Date | null;

  paidAt: Date | null;

  capturedAt: Date | null;

  failedAt: Date | null;

  cancelledAt: Date | null;

  expiredAt: Date | null;
}

/* ============================================================================
 * Customer Information
 * ========================================================================== */

export interface OrderPaymentCustomer {
  payerName: string | null;

  payerEmail: string | null;

  payerPhone: string | null;
}

/* ============================================================================
 * Payment Metadata
 * ========================================================================== */

export interface OrderPaymentMetadata {
  failureReason: string | null;

  gatewayResponse: string | null;

  notes: string | null;

  internalNotes: string | null;
}

/* ============================================================================
 * Audit
 * ========================================================================== */

export interface OrderPaymentAudit {
  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
}

/* ============================================================================
 * Aggregate
 * ========================================================================== */

export interface OrderPayment
  extends OrderPaymentIdentity,
    OrderPaymentInformation,
    OrderPaymentGatewayInformation,
    OrderPaymentTimeline,
    OrderPaymentCustomer,
    OrderPaymentMetadata,
    OrderPaymentAudit {}

/* ============================================================================
 * DTOs
 * ========================================================================== */

export interface CreateOrderPaymentInput {
  orderId: string;

  sellerId: string;

  paymentNumber: string;

  paymentMethod: OrderPaymentMethod;

  paymentGateway: OrderPaymentGateway;

  currency: string;

  amount: string;

  gatewayFee?: string | null;

  platformFee?: string | null;

  taxAmount?: string | null;

  netAmount?: string | null;

  notes?: string | null;

  internalNotes?: string | null;
}

export interface UpdateOrderPaymentInput {
  paymentStatus?: OrderPaymentStatus;

  transactionId?: string | null;

  gatewayPaymentId?: string | null;

  gatewayOrderId?: string | null;

  gatewayReferenceId?: string | null;

  gatewaySignature?: string | null;

  payerName?: string | null;

  payerEmail?: string | null;

  payerPhone?: string | null;

  gatewayFee?: string | null;

  platformFee?: string | null;

  taxAmount?: string | null;

  netAmount?: string | null;

  initiatedAt?: Date | null;

  authorizedAt?: Date | null;

  paidAt?: Date | null;

  capturedAt?: Date | null;

  failedAt?: Date | null;

  cancelledAt?: Date | null;

  expiredAt?: Date | null;

  failureReason?: string | null;

  gatewayResponse?: string | null;

  notes?: string | null;

  internalNotes?: string | null;
}

/* ============================================================================
 * Payment Summary
 * ========================================================================== */

export interface PaymentSummary {
  paymentNumber: string;

  paymentStatus: OrderPaymentStatus;

  paymentMethod: OrderPaymentMethod;

  paymentGateway: OrderPaymentGateway;

  amount: string;

  currency: string;

  paidAt: Date | null;
}

/* ============================================================================
 * Dashboard
 * ========================================================================== */

export interface PaymentDashboardSummary {
  totalPayments: number;

  successfulPayments: number;

  pendingPayments: number;

  failedPayments: number;

  refundedPayments: number;

  totalRevenue: string;

  totalRefunds: string;
}

/* ============================================================================
 * Search Filters
 * ========================================================================== */

export interface OrderPaymentSearchFilter {
  orderId?: string;

  sellerId?: string;

  paymentStatus?: OrderPaymentStatus;

  paymentMethod?: OrderPaymentMethod;

  paymentGateway?: OrderPaymentGateway;

  transactionId?: string;

  paymentNumber?: string;

  gatewayPaymentId?: string;

  gatewayOrderId?: string;

  fromDate?: Date;

  toDate?: Date;

  minAmount?: string;

  maxAmount?: string;

  search?: string;

  page?: number;

  limit?: number;
}
// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/types.ts
// Description: Shared Order module types
// Phase: 6.1.3
// ============================================================================

import type {
  orderPriorityEnum,
  orderStatusEnum,
  paymentMethodEnum,
  paymentStatusEnum,
  shippingMethodEnum,
} from "./constants";

/* ============================================================================
 * Enum Types
 * ========================================================================== */

export type OrderStatus =
  (typeof orderStatusEnum.enumValues)[number];

export type PaymentStatus =
  (typeof paymentStatusEnum.enumValues)[number];

export type PaymentMethod =
  (typeof paymentMethodEnum.enumValues)[number];

export type ShippingMethod =
  (typeof shippingMethodEnum.enumValues)[number];

export type OrderPriority =
  (typeof orderPriorityEnum.enumValues)[number];

/* ============================================================================
 * Identity
 * ========================================================================== */

export interface OrderIdentity {
  id: string;
  orderNumber: string;

  sellerId: string;
  buyerId: string;
  storeId: string;

  shippingAddressId: string | null;
  billingAddressId: string | null;
}

/* ============================================================================
 * Buyer Snapshot
 * ========================================================================== */

export interface OrderBuyerSnapshot {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
}

/* ============================================================================
 * Financial Summary
 * ========================================================================== */

export interface OrderFinancialSummary {
  currency: string;

  subtotal: string;

  discountAmount: string;

  couponDiscount: string;

  shippingCharge: string;

  taxAmount: string;

  grandTotal: string;
}

/* ============================================================================
 * Payment Summary
 * ========================================================================== */

export interface OrderPaymentSummary {
  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;
}

/* ============================================================================
 * Shipping Summary
 * ========================================================================== */

export interface OrderShippingSummary {
  shippingMethod: ShippingMethod;

  expectedDeliveryDate: Date | null;

  actualDeliveryDate: Date | null;
}

/* ============================================================================
 * Business Flags
 * ========================================================================== */

export interface OrderBusinessFlags {
  isGift: boolean;

  giftMessage: string | null;

  requiresSignature: boolean;
}

/* ============================================================================
 * Seller Notes
 * ========================================================================== */

export interface OrderRemarks {
  sellerRemark: string | null;

  internalRemark: string | null;
}

/* ============================================================================
 * Lifecycle
 * ========================================================================== */

export interface OrderLifecycle {
  status: OrderStatus;

  priority: OrderPriority;

  acceptedAt: Date | null;

  packedAt: Date | null;

  readyAt: Date | null;

  shippedAt: Date | null;

  deliveredAt: Date | null;

  cancelledAt: Date | null;

  returnedAt: Date | null;
}

/* ============================================================================
 * Audit
 * ========================================================================== */

export interface OrderAudit {
  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
}

/* ============================================================================
 * Aggregate
 * ========================================================================== */

export interface Order
  extends OrderIdentity,
    OrderBuyerSnapshot,
    OrderFinancialSummary,
    OrderPaymentSummary,
    OrderShippingSummary,
    OrderBusinessFlags,
    OrderRemarks,
    OrderLifecycle,
    OrderAudit {}

/* ============================================================================
 * DTOs
 * ========================================================================== */

export interface CreateOrderInput {
  sellerId: string;

  buyerId: string;

  storeId: string;

  shippingAddressId: string;

  billingAddressId?: string | null;
}

export interface UpdateOrderInput {
  status?: OrderStatus;

  priority?: OrderPriority;

  paymentStatus?: PaymentStatus;

  paymentMethod?: PaymentMethod;

  shippingMethod?: ShippingMethod;

  sellerRemark?: string | null;

  internalRemark?: string | null;

  expectedDeliveryDate?: Date | null;

  actualDeliveryDate?: Date | null;
}

/* ============================================================================
 * List Item
 * ========================================================================== */

export interface OrderListItem {
  id: string;

  orderNumber: string;

  buyerName: string;

  status: OrderStatus;

  paymentStatus: PaymentStatus;

  grandTotal: string;

  createdAt: Date;
}

/* ============================================================================
 * Summary
 * ========================================================================== */

export interface OrderSummary {
  totalItems: number;

  subtotal: string;

  shippingCharge: string;

  taxAmount: string;

  discountAmount: string;

  grandTotal: string;
}

/* ============================================================================
 * Timeline
 * ========================================================================== */

export interface OrderTimeline {
  acceptedAt: Date | null;

  packedAt: Date | null;

  readyAt: Date | null;

  shippedAt: Date | null;

  deliveredAt: Date | null;

  cancelledAt: Date | null;

  returnedAt: Date | null;
}

/* ============================================================================
 * Search & Filters
 * ========================================================================== */

export interface OrderSearchFilter {
  search?: string;

  sellerId?: string;

  buyerId?: string;

  storeId?: string;

  status?: OrderStatus;

  paymentStatus?: PaymentStatus;

  paymentMethod?: PaymentMethod;

  shippingMethod?: ShippingMethod;

  priority?: OrderPriority;

  fromDate?: Date;

  toDate?: Date;

  page?: number;

  limit?: number;
}
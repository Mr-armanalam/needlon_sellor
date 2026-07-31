// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-status-history/types.ts
// Description: Shared Order Status History types
// Phase: 6.3.3
// ============================================================================

import type {
  orderStatusActionEnum,
  orderStatusResultEnum,
  orderStatusSourceEnum,
} from "./constants";

import type {
  OrderStatus,
} from "../types";

/* ============================================================================
 * Enum Types
 * ========================================================================== */

export type OrderStatusAction =
  (typeof orderStatusActionEnum.enumValues)[number];

export type OrderStatusSource =
  (typeof orderStatusSourceEnum.enumValues)[number];

export type OrderStatusResult =
  (typeof orderStatusResultEnum.enumValues)[number];

/* ============================================================================
 * Identity
 * ========================================================================== */

export interface OrderStatusHistoryIdentity {
  id: string;

  orderId: string;

  sellerId: string;

  changedByUserId: string | null;
}

/* ============================================================================
 * Status Transition
 * ========================================================================== */

export interface OrderStatusTransition {
  fromStatus: OrderStatus | null;

  toStatus: OrderStatus;

  action: OrderStatusAction;

  source: OrderStatusSource;

  result: OrderStatusResult;
}

/* ============================================================================
 * Transition Details
 * ========================================================================== */

export interface OrderStatusTransitionDetails {
  reason: string | null;

  remarks: string | null;

  referenceId: string | null;
}

/* ============================================================================
 * Request Metadata
 * ========================================================================== */

export interface OrderStatusRequestMetadata {
  ipAddress: string | null;

  userAgent: string | null;
}

/* ============================================================================
 * Audit
 * ========================================================================== */

export interface OrderStatusAudit {
  changedAt: Date;

  createdAt: Date;
}

/* ============================================================================
 * Aggregate
 * ========================================================================== */

export interface OrderStatusHistory
  extends OrderStatusHistoryIdentity,
    OrderStatusTransition,
    OrderStatusTransitionDetails,
    OrderStatusRequestMetadata,
    OrderStatusAudit {}

/* ============================================================================
 * DTOs
 * ========================================================================== */

export interface CreateOrderStatusHistoryInput {
  orderId: string;

  sellerId: string;

  changedByUserId?: string | null;

  fromStatus?: OrderStatus | null;

  toStatus: OrderStatus;

  action: OrderStatusAction;

  source?: OrderStatusSource;

  result?: OrderStatusResult;

  reason?: string | null;

  remarks?: string | null;

  referenceId?: string | null;

  ipAddress?: string | null;

  userAgent?: string | null;
}

export interface UpdateOrderStatusHistoryInput {
  /**
   * Append-only entity.
   *
   * Updates are intentionally not supported.
   */
}

/* ============================================================================
 * Timeline
 * ========================================================================== */

export interface OrderStatusTimelineItem {
  id: string;

  fromStatus: OrderStatus | null;

  toStatus: OrderStatus;

  action: OrderStatusAction;

  source: OrderStatusSource;

  result: OrderStatusResult;

  changedAt: Date;
}

/* ============================================================================
 * Summary
 * ========================================================================== */

export interface OrderStatusHistorySummary {
  totalTransitions: number;

  latestStatus: OrderStatus;

  latestChangedAt: Date;
}

/* ============================================================================
 * Search & Filters
 * ========================================================================== */

export interface OrderStatusHistorySearchFilter {
  orderId?: string;

  sellerId?: string;

  changedByUserId?: string;

  action?: OrderStatusAction;

  source?: OrderStatusSource;

  result?: OrderStatusResult;

  fromStatus?: OrderStatus;

  toStatus?: OrderStatus;

  fromDate?: Date;

  toDate?: Date;

  search?: string;

  page?: number;

  limit?: number;
}
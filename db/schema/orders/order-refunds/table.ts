// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-refunds/table.ts
// Description: Order Refunds table
// Phase: 6.7.4.1 - Foundation
// ============================================================================

import {
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { orders } from "../table";

import { orderReturns } from "../order-returns/table";

import { orderPayments } from "../order-payments/table";

import { seller } from "@/db/schema/seller";

import {
  orderRefundApprovalStatusEnum,
  orderRefundGatewayEnum,
  orderRefundMethodEnum,
  orderRefundReasonEnum,
  orderRefundStatusEnum,
  orderRefundTypeEnum,
} from "./constants";

/**
 * ============================================================================
 * Order Refunds
 * ============================================================================
 *
 * Stores every refund transaction created by the marketplace.
 *
 * Supports
 *
 * • Full Refunds
 * • Partial Refunds
 * • Shipping Refunds
 * • Manual Refunds
 * • Store Credit
 * • Gateway Refunds
 * • Retry Mechanism
 * • Financial Audit
 * • Reconciliation
 *
 * One Order
 *      │
 *      ├────────► Refund #1
 *      ├────────► Refund #2
 *      └────────► Refund #3
 *
 * A refund may originate from:
 *
 * • Order Cancellation
 * • Approved Return
 * • Manual Adjustment
 * • Goodwill Compensation
 *
 * ============================================================================
 */

export const orderRefunds = pgTable(
  "order_refunds",
  {
    /**
     * ------------------------------------------------------------------------
     * Primary Identity
     * ------------------------------------------------------------------------
     */

    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    /**
     * ------------------------------------------------------------------------
     * Parent Order
     * ------------------------------------------------------------------------
     */

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    /**
     * ------------------------------------------------------------------------
     * Return
     * ------------------------------------------------------------------------
     *
     * Nullable because refunds may occur
     * without a return request.
     */

    orderReturnId: uuid(
      "order_return_id",
    ).references(() => orderReturns.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),

    /**
     * ------------------------------------------------------------------------
     * Payment
     * ------------------------------------------------------------------------
     *
     * Original payment associated with
     * this refund.
     */

    paymentId: uuid("payment_id")
      .references(() => orderPayments.id, {
        onDelete: "set null",
        onUpdate: "cascade",
      }),

    /**
     * ------------------------------------------------------------------------
     * Seller
     * ------------------------------------------------------------------------
     */

    sellerId: uuid("seller_id")
      .notNull()
      .references(() => seller.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),

    // ---------------------------------------------------------------------
    // Remaining columns implemented in:
    //
    // Phase 6.7.4.2
    // Refund Information
    //

        /**
     * ------------------------------------------------------------------------
     * Refund Information
     * ------------------------------------------------------------------------
     *
     * Business identity and refund workflow.
     * ------------------------------------------------------------------------
     */

    refundNumber: varchar(
      "refund_number",
      {
        length: 100,
      },
    ).notNull(),

    /**
     * ------------------------------------------------------------------------
     * Refund Status
     * ------------------------------------------------------------------------
     */

    refundStatus:
      orderRefundStatusEnum(
        "refund_status",
      )
        .notNull()
        .default("PENDING"),

    /**
     * ------------------------------------------------------------------------
     * Refund Type
     * ------------------------------------------------------------------------
     */

    refundType:
      orderRefundTypeEnum(
        "refund_type",
      ).notNull(),

    /**
     * ------------------------------------------------------------------------
     * Refund Reason
     * ------------------------------------------------------------------------
     */

    refundReason:
      orderRefundReasonEnum(
        "refund_reason",
      ).notNull(),

    /**
     * ------------------------------------------------------------------------
     * Approval Workflow
     * ------------------------------------------------------------------------
     */

    approvalStatus:
      orderRefundApprovalStatusEnum(
        "approval_status",
      )
        .notNull()
        .default("PENDING"),

    /**
     * ------------------------------------------------------------------------
     * Refund Method
     * ------------------------------------------------------------------------
     */

    refundMethod:
      orderRefundMethodEnum(
        "refund_method",
      ).notNull(),

    /**
     * ------------------------------------------------------------------------
     * Payment Gateway
     * ------------------------------------------------------------------------
     */

    refundGateway:
      orderRefundGatewayEnum(
        "refund_gateway",
      )
        .notNull()
        .default("NONE"),

    // Phase 6.7.4.3
    // Financial & Gateway
    //

        /**
     * ------------------------------------------------------------------------
     * Financial Information
     * ------------------------------------------------------------------------
     */

    refundAmount: numeric(
      "refund_amount",
      {
        precision: 18,
        scale: 2,
      },
    ).notNull(),

    currency: varchar(
      "currency",
      {
        length: 10,
      },
    )
      .notNull()
      .default("INR"),

    exchangeRate: numeric(
      "exchange_rate",
      {
        precision: 18,
        scale: 8,
      },
    ),

    gatewayFee: numeric(
      "gateway_fee",
      {
        precision: 18,
        scale: 2,
      },
    ),

    processingFee: numeric(
      "processing_fee",
      {
        precision: 18,
        scale: 2,
      },
    ),

    taxAmount: numeric(
      "tax_amount",
      {
        precision: 18,
        scale: 2,
      },
    ),

    netRefundAmount: numeric(
      "net_refund_amount",
      {
        precision: 18,
        scale: 2,
      },
    ),

    /**
     * ------------------------------------------------------------------------
     * Payment Gateway Information
     * ------------------------------------------------------------------------
     */

    transactionId: varchar(
      "transaction_id",
      {
        length: 255,
      },
    ),

    gatewayPaymentId: varchar(
      "gateway_payment_id",
      {
        length: 255,
      },
    ),

    gatewayRefundId: varchar(
      "gateway_refund_id",
      {
        length: 255,
      },
    ),

    gatewayReferenceId: varchar(
      "gateway_reference_id",
      {
        length: 255,
      },
    ),

    /**
     * ------------------------------------------------------------------------
     * Gateway Response
     * ------------------------------------------------------------------------
     *
     * Stores complete gateway payload
     * for reconciliation and audit.
     */

    gatewayResponse: jsonb(
      "gateway_response",
    ).$type<Record<
      string,
      unknown
    >>(),

    // Phase 6.7.4.4
    // Retry, Approval & Timeline
    //

        /**
     * ------------------------------------------------------------------------
     * Retry Management
     * ------------------------------------------------------------------------
     *
     * Used for gateway failures, webhook retries,
     * reconciliation retries and transient errors.
     * ------------------------------------------------------------------------
     */

    retryCount: integer(
      "retry_count",
    )
      .notNull()
      .default(0),

    maxRetryCount: integer(
      "max_retry_count",
    )
      .notNull()
      .default(3),

    nextRetryAt: timestamp(
      "next_retry_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    lastRetryAt: timestamp(
      "last_retry_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    failureReason: text(
      "failure_reason",
    ),

    /**
     * ------------------------------------------------------------------------
     * Approval
     * ------------------------------------------------------------------------
     */

    approvedBy: uuid(
      "approved_by",
    ),

    approvalRemarks: text(
      "approval_remarks",
    ),

    /**
     * ------------------------------------------------------------------------
     * Refund Timeline
     * ------------------------------------------------------------------------
     */

    initiatedAt: timestamp(
      "initiated_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    approvedAt: timestamp(
      "approved_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    processedAt: timestamp(
      "processed_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    completedAt: timestamp(
      "completed_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    failedAt: timestamp(
      "failed_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    cancelledAt: timestamp(
      "cancelled_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    /**
     * ------------------------------------------------------------------------
     * Gateway Webhook
     * ------------------------------------------------------------------------
     */

    webhookReceivedAt: timestamp(
      "webhook_received_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    webhookPayload: jsonb(
      "webhook_payload",
    ).$type<
      Record<
        string,
        unknown
      >
    >(),

    // Phase 6.7.4.5
    // Metadata
    // Audit
    // Production Indexes
    // ---------------------------------------------------------------------

        /**
     * ------------------------------------------------------------------------
     * Internal Metadata
     * ------------------------------------------------------------------------
     */

    internalNotes: text(
      "internal_notes",
    ),

    /**
     * ------------------------------------------------------------------------
     * Audit
     * ------------------------------------------------------------------------
     */

    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
        mode: "date",
      },
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone: true,
        mode: "date",
      },
    )
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),

    /**
     * ------------------------------------------------------------------------
     * Soft Delete
     * ------------------------------------------------------------------------
     */

    deletedAt: timestamp(
      "deleted_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),
  },

  (table) => ({
    /**
     * ------------------------------------------------------------------------
     * Foundation Indexes
     * ------------------------------------------------------------------------
     */

    orderIdx: index(
      "order_refunds_order_idx",
    ).on(table.orderId),

    returnIdx: index(
      "order_refunds_return_idx",
    ).on(table.orderReturnId),

    paymentIdx: index(
      "order_refunds_payment_idx",
    ).on(table.paymentId),

    sellerIdx: index(
      "order_refunds_seller_idx",
    ).on(table.sellerId),

    /**
     * ------------------------------------------------------------------------
     * Seller Dashboard
     * ------------------------------------------------------------------------
     */

    sellerOrderIdx: index(
      "order_refunds_seller_order_idx",
    ).on(
      table.sellerId,
      table.orderId,
    ),

    /**
     * ------------------------------------------------------------------------
     * Financial Lookup
     * ------------------------------------------------------------------------
     */

    orderPaymentIdx: index(
      "order_refunds_order_payment_idx",
    ).on(
      table.orderId,
      table.paymentId,
    ),

    /**
     * ------------------------------------------------------------------------
     * Return Refund Lookup
     * ------------------------------------------------------------------------
     */

    returnSellerIdx: index(
      "order_refunds_return_seller_idx",
    ).on(
      table.orderReturnId,
      table.sellerId,
    ),

        /**
     * ------------------------------------------------------------------------
     * Refund Information
     * ------------------------------------------------------------------------
     */

    refundNumberIdx: index(
      "order_refunds_refund_number_idx",
    ).on(
      table.refundNumber,
    ),

    refundStatusIdx: index(
      "order_refunds_status_idx",
    ).on(
      table.refundStatus,
    ),

    refundTypeIdx: index(
      "order_refunds_type_idx",
    ).on(
      table.refundType,
    ),

    refundReasonIdx: index(
      "order_refunds_reason_idx",
    ).on(
      table.refundReason,
    ),

    approvalStatusIdx: index(
      "order_refunds_approval_status_idx",
    ).on(
      table.approvalStatus,
    ),

    refundMethodIdx: index(
      "order_refunds_method_idx",
    ).on(
      table.refundMethod,
    ),

    refundGatewayIdx: index(
      "order_refunds_gateway_idx",
    ).on(
      table.refundGateway,
    ),

    /**
     * ------------------------------------------------------------------------
     * Seller Dashboard
     * ------------------------------------------------------------------------
     */

    sellerRefundStatusIdx: index(
      "order_refunds_seller_status_idx",
    ).on(
      table.sellerId,
      table.refundStatus,
    ),

    sellerApprovalIdx: index(
      "order_refunds_seller_approval_idx",
    ).on(
      table.sellerId,
      table.approvalStatus,
    ),

    /**
     * ------------------------------------------------------------------------
     * Order Detail
     * ------------------------------------------------------------------------
     */

    orderRefundStatusIdx: index(
      "order_refunds_order_status_idx",
    ).on(
      table.orderId,
      table.refundStatus,
    ),

    orderRefundNumberIdx: index(
      "order_refunds_order_number_idx",
    ).on(
      table.orderId,
      table.refundNumber,
    ),

    /**
     * ------------------------------------------------------------------------
     * Financial Operations
     * ------------------------------------------------------------------------
     */

    approvalWorkflowIdx: index(
      "order_refunds_approval_workflow_idx",
    ).on(
      table.approvalStatus,
      table.refundStatus,
    ),

    gatewayWorkflowIdx: index(
      "order_refunds_gateway_workflow_idx",
    ).on(
      table.refundGateway,
      table.refundStatus,
    ),

    methodWorkflowIdx: index(
      "order_refunds_method_workflow_idx",
    ).on(
      table.refundMethod,
      table.refundStatus,
    ),

        /**
     * ------------------------------------------------------------------------
     * Financial
     * ------------------------------------------------------------------------
     */

    refundAmountIdx: index(
      "order_refunds_amount_idx",
    ).on(
      table.refundAmount,
    ),

    currencyIdx: index(
      "order_refunds_currency_idx",
    ).on(
      table.currency,
    ),

    netRefundAmountIdx: index(
      "order_refunds_net_amount_idx",
    ).on(
      table.netRefundAmount,
    ),

    /**
     * ------------------------------------------------------------------------
     * Gateway
     * ------------------------------------------------------------------------
     */

    transactionIdIdx: index(
      "order_refunds_transaction_idx",
    ).on(
      table.transactionId,
    ),

    gatewayPaymentIdx: index(
      "order_refunds_gateway_payment_idx",
    ).on(
      table.gatewayPaymentId,
    ),

    gatewayRefundIdx: index(
      "order_refunds_gateway_refund_idx",
    ).on(
      table.gatewayRefundId,
    ),

    gatewayReferenceIdx: index(
      "order_refunds_gateway_reference_idx",
    ).on(
      table.gatewayReferenceId,
    ),

    /**
     * ------------------------------------------------------------------------
     * Financial Dashboard
     * ------------------------------------------------------------------------
     */

    financialDashboardIdx: index(
      "order_refunds_financial_dashboard_idx",
    ).on(
      table.refundStatus,
      table.refundAmount,
    ),

    gatewayDashboardIdx: index(
      "order_refunds_gateway_dashboard_idx",
    ).on(
      table.refundGateway,
      table.refundStatus,
    ),

    gatewayTransactionIdx: index(
      "order_refunds_gateway_transaction_idx",
    ).on(
      table.refundGateway,
      table.transactionId,
    ),

    sellerFinancialIdx: index(
      "order_refunds_seller_financial_idx",
    ).on(
      table.sellerId,
      table.refundStatus,
      table.refundAmount,
    ),

    reconciliationIdx: index(
      "order_refunds_reconciliation_idx",
    ).on(
      table.gatewayPaymentId,
      table.gatewayRefundId,
    ),

        /**
     * ------------------------------------------------------------------------
     * Retry Management
     * ------------------------------------------------------------------------
     */

    retryCountIdx: index(
      "order_refunds_retry_count_idx",
    ).on(
      table.retryCount,
    ),

    nextRetryIdx: index(
      "order_refunds_next_retry_idx",
    ).on(
      table.nextRetryAt,
    ),

    lastRetryIdx: index(
      "order_refunds_last_retry_idx",
    ).on(
      table.lastRetryAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Approval
     * ------------------------------------------------------------------------
     */

    approvedByIdx: index(
      "order_refunds_approved_by_idx",
    ).on(
      table.approvedBy,
    ),

    /**
     * ------------------------------------------------------------------------
     * Timeline
     * ------------------------------------------------------------------------
     */

    initiatedAtIdx: index(
      "order_refunds_initiated_at_idx",
    ).on(
      table.initiatedAt,
    ),

    approvedAtIdx: index(
      "order_refunds_approved_at_idx",
    ).on(
      table.approvedAt,
    ),

    processedAtIdx: index(
      "order_refunds_processed_at_idx",
    ).on(
      table.processedAt,
    ),

    completedAtIdx: index(
      "order_refunds_completed_at_idx",
    ).on(
      table.completedAt,
    ),

    failedAtIdx: index(
      "order_refunds_failed_at_idx",
    ).on(
      table.failedAt,
    ),

    cancelledAtIdx: index(
      "order_refunds_cancelled_at_idx",
    ).on(
      table.cancelledAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Retry Queue
     * ------------------------------------------------------------------------
     */

    retryQueueIdx: index(
      "order_refunds_retry_queue_idx",
    ).on(
      table.refundStatus,
      table.nextRetryAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Approval Queue
     * ------------------------------------------------------------------------
     */

    approvalQueueIdx: index(
      "order_refunds_approval_queue_idx",
    ).on(
      table.approvalStatus,
      table.createdAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Gateway Processing
     * ------------------------------------------------------------------------
     */

    processingQueueIdx: index(
      "order_refunds_processing_queue_idx",
    ).on(
      table.refundGateway,
      table.refundStatus,
      table.processedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Timeline Dashboard
     * ------------------------------------------------------------------------
     */

    refundTimelineIdx: index(
      "order_refunds_timeline_idx",
    ).on(
      table.refundStatus,
      table.initiatedAt,
      table.completedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Failed Refund Dashboard
     * ------------------------------------------------------------------------
     */

    failedRefundIdx: index(
      "order_refunds_failed_dashboard_idx",
    ).on(
      table.refundStatus,
      table.failedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Webhook Processing
     * ------------------------------------------------------------------------
     */

    webhookReceivedIdx: index(
      "order_refunds_webhook_idx",
    ).on(
      table.webhookReceivedAt,
    ),

        /**
     * ------------------------------------------------------------------------
     * Audit
     * ------------------------------------------------------------------------
     */

    createdAtIdx: index(
      "order_refunds_created_at_idx",
    ).on(
      table.createdAt,
    ),

    updatedAtIdx: index(
      "order_refunds_updated_at_idx",
    ).on(
      table.updatedAt,
    ),

    deletedAtIdx: index(
      "order_refunds_deleted_at_idx",
    ).on(
      table.deletedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Seller Dashboard
     * ------------------------------------------------------------------------
     */

    sellerDashboardIdx: index(
      "order_refunds_dashboard_idx",
    ).on(
      table.sellerId,
      table.refundStatus,
      table.createdAt,
    ),

    sellerTimelineIdx: index(
      "order_refunds_seller_timeline_idx",
    ).on(
      table.sellerId,
      table.completedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Financial Analytics
     * ------------------------------------------------------------------------
     */

    financialAnalyticsIdx: index(
      "order_refunds_financial_analytics_idx",
    ).on(
      table.refundStatus,
      table.refundAmount,
      table.completedAt,
    ),

    refundTypeAnalyticsIdx: index(
      "order_refunds_type_analytics_idx",
    ).on(
      table.refundType,
      table.completedAt,
    ),

    gatewayAnalyticsIdx: index(
      "order_refunds_gateway_analytics_idx",
    ).on(
      table.refundGateway,
      table.completedAt,
    ),

    methodAnalyticsIdx: index(
      "order_refunds_method_analytics_idx",
    ).on(
      table.refundMethod,
      table.completedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Reconciliation
     * ------------------------------------------------------------------------
     */

    reconciliationDashboardIdx: index(
      "order_refunds_reconciliation_dashboard_idx",
    ).on(
      table.gatewayPaymentId,
      table.gatewayRefundId,
      table.completedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Order Dashboard
     * ------------------------------------------------------------------------
     */

    orderDashboardIdx: index(
      "order_refunds_order_dashboard_idx",
    ).on(
      table.orderId,
      table.refundStatus,
      table.createdAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Return Dashboard
     * ------------------------------------------------------------------------
     */

    returnDashboardIdx: index(
      "order_refunds_return_dashboard_idx",
    ).on(
      table.orderReturnId,
      table.refundStatus,
    ),

    /**
     * ------------------------------------------------------------------------
     * Active Refunds
     * ------------------------------------------------------------------------
     */

    activeRefundIdx: index(
      "order_refunds_active_idx",
    ).on(
      table.deletedAt,
      table.refundStatus,
    ),

    /**
     * ------------------------------------------------------------------------
     * Processing Dashboard
     * ------------------------------------------------------------------------
     */

    processingDashboardIdx: index(
      "order_refunds_processing_dashboard_idx",
    ).on(
      table.refundStatus,
      table.approvalStatus,
      table.refundGateway,
      table.createdAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Monthly Finance Reports
     * ------------------------------------------------------------------------
     */

    monthlyFinanceIdx: index(
      "order_refunds_monthly_finance_idx",
    ).on(
      table.completedAt,
      table.refundAmount,
      table.currency,
    ),

  }),
);
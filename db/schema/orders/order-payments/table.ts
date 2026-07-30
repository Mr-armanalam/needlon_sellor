// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-payments/table.ts
// Description: Order Payments table
// Phase: 6.5.4.1 - Foundation
// ============================================================================

import {
  index,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { orders } from "../table";

import { seller } from "@/db/schema/seller";
import {
  paymentGatewayEnum,
  paymentModeEnum,
  settlementStatusEnum,
} from "./constants";


/**
 * ============================================================================
 * Order Payments
 * ============================================================================
 *
 * Represents a payment transaction associated with an order.
 *
 * Supports
 *
 * • Online Payments
 * • Cash on Delivery (COD)
 * • UPI
 * • Wallets
 * • Cards
 * • Net Banking
 * • Multiple Payment Attempts
 * • Partial Payments
 * • Refunds
 * • Payment Gateway Integration
 *
 * One Order
 *      │
 *      ├────────► Payment Attempt #1
 *      │
 *      ├────────► Payment Attempt #2
 *      │
 *      └────────► Payment Attempt #3
 *
 * Each payment record represents one payment transaction.
 *
 * ============================================================================
 */

export const orderPayments = pgTable(
  "order_payments",
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
     * Seller
     * ------------------------------------------------------------------------
     *
     * Seller receiving this payment.
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
    // Phase 6.5.4.2
    // Payment Information
    //

        /**
     * ------------------------------------------------------------------------
     * Payment Information
     * ------------------------------------------------------------------------
     *
     * Business information for a payment transaction.
     *
     * One order may have multiple payment attempts.
     * Each payment has its own unique payment number.
     * ------------------------------------------------------------------------
     */

    paymentNumber: varchar("payment_number", {
      length: 100,
    }).notNull(),

    paymentStatus: settlementStatusEnum(
      "payment_status",
    )
      .notNull()
      .default("PENDING"),

    /**
     * ------------------------------------------------------------------------
     * Payment Method
     * ------------------------------------------------------------------------
     */

    paymentMethod: paymentModeEnum(
      "payment_method",
    )
      .notNull(),

    /**
     * ------------------------------------------------------------------------
     * Payment Gateway
     * ------------------------------------------------------------------------
     */

    paymentGateway: paymentGatewayEnum(
      "payment_gateway",
    )
      .notNull(),

    /**
     * ------------------------------------------------------------------------
     * Currency
     * ------------------------------------------------------------------------
     */

    currency: varchar("currency", {
      length: 10,
    })
      .notNull()
      .default("INR"),

    /**
     * ------------------------------------------------------------------------
     * Payment Amounts
     * ------------------------------------------------------------------------
     *
     * Monetary values are stored using NUMERIC
     * to preserve precision.
     * ------------------------------------------------------------------------
     */

    amount: numeric("amount", {
      precision: 18,
      scale: 2,
    }).notNull(),

    gatewayFee: numeric("gateway_fee", {
      precision: 18,
      scale: 2,
    }),

    platformFee: numeric("platform_fee", {
      precision: 18,
      scale: 2,
    }),

    taxAmount: numeric("tax_amount", {
      precision: 18,
      scale: 2,
    }),

    netAmount: numeric("net_amount", {
      precision: 18,
      scale: 2,
    }).notNull(),


    // Phase 6.5.4.3
    // Gateway Information
    //

        /**
     * ------------------------------------------------------------------------
     * Payment Gateway Information
     * ------------------------------------------------------------------------
     *
     * External identifiers returned by the payment gateway.
     *
     * These values are used for:
     *
     * • Payment Verification
     * • Webhook Processing
     * • Refunds
     * • Settlement
     * • Reconciliation
     * • Customer Support
     * ------------------------------------------------------------------------
     */

    transactionId: varchar("transaction_id", {
      length: 255,
    }),

    /**
     * ------------------------------------------------------------------------
     * Gateway Payment ID
     * ------------------------------------------------------------------------
     *
     * Example
     *
     * Razorpay
     * pay_NdKxxxxxxx
     *
     * Stripe
     * pi_xxxxxxxxx
     * ------------------------------------------------------------------------
     */

    gatewayPaymentId: varchar(
      "gateway_payment_id",
      {
        length: 255,
      },
    ),

    /**
     * ------------------------------------------------------------------------
     * Gateway Order ID
     * ------------------------------------------------------------------------
     *
     * Payment gateway order identifier.
     * ------------------------------------------------------------------------
     */

    gatewayOrderId: varchar(
      "gateway_order_id",
      {
        length: 255,
      },
    ),

    /**
     * ------------------------------------------------------------------------
     * Gateway Reference ID
     * ------------------------------------------------------------------------
     *
     * Merchant reference or reconciliation identifier.
     * ------------------------------------------------------------------------
     */

    gatewayReferenceId: varchar(
      "gateway_reference_id",
      {
        length: 255,
      },
    ),

    /**
     * ------------------------------------------------------------------------
     * Gateway Signature
     * ------------------------------------------------------------------------
     *
     * Used for payment verification.
     *
     * Example:
     * Razorpay Signature
     * Stripe Signature
     * ------------------------------------------------------------------------
     */

    gatewaySignature: text(
      "gateway_signature",
    ),

    // Phase 6.5.4.4
    // Payment Timeline
    //

        /**
     * ------------------------------------------------------------------------
     * Payment Timeline
     * ------------------------------------------------------------------------
     *
     * Complete lifecycle of a payment transaction.
     *
     * Every timestamp is optional because
     * not every payment reaches every stage.
     *
     * Example
     *
     * Initiated
     *      │
     *      ▼
     * Authorized
     *      │
     *      ▼
     * Paid
     *      │
     *      ▼
     * Captured
     * ------------------------------------------------------------------------
     */

    initiatedAt: timestamp("initiated_at", {
      withTimezone: true,
      mode: "date",
    }),

    authorizedAt: timestamp("authorized_at", {
      withTimezone: true,
      mode: "date",
    }),

    paidAt: timestamp("paid_at", {
      withTimezone: true,
      mode: "date",
    }),

    capturedAt: timestamp("captured_at", {
      withTimezone: true,
      mode: "date",
    }),

    /**
     * ------------------------------------------------------------------------
     * Failure Lifecycle
     * ------------------------------------------------------------------------
     */

    failedAt: timestamp("failed_at", {
      withTimezone: true,
      mode: "date",
    }),

    cancelledAt: timestamp("cancelled_at", {
      withTimezone: true,
      mode: "date",
    }),

    expiredAt: timestamp("expired_at", {
      withTimezone: true,
      mode: "date",
    }),


    // Phase 6.5.4.5
    // Customer Information
    // Metadata
    // Audit
    // Production Indexes
    // ---------------------------------------------------------------------


        /**
     * ------------------------------------------------------------------------
     * Customer Information
     * ------------------------------------------------------------------------
     *
     * Snapshot of payer information at the time of payment.
     *
     * Stored for reconciliation, invoices,
     * payment disputes and support.
     * ------------------------------------------------------------------------
     */

    payerName: varchar("payer_name", {
      length: 255,
    }),

    payerEmail: varchar("payer_email", {
      length: 320,
    }),

    payerPhone: varchar("payer_phone", {
      length: 20,
    }),

    /**
     * ------------------------------------------------------------------------
     * Payment Metadata
     * ------------------------------------------------------------------------
     *
     * Operational information.
     * ------------------------------------------------------------------------
     */

    failureReason: text(
      "failure_reason",
    ),

    /**
     * Raw gateway response.
     *
     * May contain JSON payload returned
     * by Razorpay, Stripe, Cashfree etc.
     */

    gatewayResponse: jsonb(
      "gateway_response",
    ),

    /**
     * Customer visible notes.
     */

    notes: text("notes"),

    /**
     * Internal notes.
     *
     * Visible only to
     * Admin
     * Seller
     * Finance Team
     */

    internalNotes: text(
      "internal_notes",
    ),

    /**
     * ------------------------------------------------------------------------
     * Audit
     * ------------------------------------------------------------------------
     */

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),

    /**
     * ------------------------------------------------------------------------
     * Soft Delete
     * ------------------------------------------------------------------------
     */

    deletedAt: timestamp("deleted_at", {
      withTimezone: true,
      mode: "date",
    }),

  },

  (table) => ({
    /**
     * ------------------------------------------------------------------------
     * Foundation Indexes
     * ------------------------------------------------------------------------
     */

    orderIdx: index(
      "order_payments_order_idx",
    ).on(table.orderId),

    sellerIdx: index(
      "order_payments_seller_idx",
    ).on(table.sellerId),

    /**
     * ------------------------------------------------------------------------
     * Dashboard Lookup
     * ------------------------------------------------------------------------
     */

    orderSellerIdx: index(
      "order_payments_order_seller_idx",
    ).on(
      table.orderId,
      table.sellerId,
    ),

        /**
     * ------------------------------------------------------------------------
     * Payment Information
     * ------------------------------------------------------------------------
     */

    paymentNumberIdx: index(
      "order_payments_payment_number_idx",
    ).on(table.paymentNumber),

    paymentStatusIdx: index(
      "order_payments_status_idx",
    ).on(table.paymentStatus),

    paymentMethodIdx: index(
      "order_payments_method_idx",
    ).on(table.paymentMethod),

    paymentGatewayIdx: index(
      "order_payments_gateway_idx",
    ).on(table.paymentGateway),

    currencyIdx: index(
      "order_payments_currency_idx",
    ).on(table.currency),

    /**
     * ------------------------------------------------------------------------
     * Financial Queries
     * ------------------------------------------------------------------------
     */

    amountIdx: index(
      "order_payments_amount_idx",
    ).on(table.amount),

    netAmountIdx: index(
      "order_payments_net_amount_idx",
    ).on(table.netAmount),

    /**
     * ------------------------------------------------------------------------
     * Dashboard
     * ------------------------------------------------------------------------
     */

    sellerPaymentStatusIdx: index(
      "order_payments_seller_status_idx",
    ).on(
      table.sellerId,
      table.paymentStatus,
    ),

    orderPaymentStatusIdx: index(
      "order_payments_order_status_idx",
    ).on(
      table.orderId,
      table.paymentStatus,
    ),

    orderPaymentNumberIdx: index(
      "order_payments_order_number_idx",
    ).on(
      table.orderId,
      table.paymentNumber,
    ),

    gatewayStatusIdx: index(
      "order_payments_gateway_status_idx",
    ).on(
      table.paymentGateway,
      table.paymentStatus,
    ),

        /**
     * ------------------------------------------------------------------------
     * Payment Timeline
     * ------------------------------------------------------------------------
     */

    initiatedAtIdx: index(
      "order_payments_initiated_at_idx",
    ).on(table.initiatedAt),

    authorizedAtIdx: index(
      "order_payments_authorized_at_idx",
    ).on(table.authorizedAt),

    paidAtIdx: index(
      "order_payments_paid_at_idx",
    ).on(table.paidAt),

    capturedAtIdx: index(
      "order_payments_captured_at_idx",
    ).on(table.capturedAt),

    failedAtIdx: index(
      "order_payments_failed_at_idx",
    ).on(table.failedAt),

    cancelledAtIdx: index(
      "order_payments_cancelled_at_idx",
    ).on(table.cancelledAt),

    expiredAtIdx: index(
      "order_payments_expired_at_idx",
    ).on(table.expiredAt),

    /**
     * ------------------------------------------------------------------------
     * Seller Dashboard
     * ------------------------------------------------------------------------
     */

    sellerPaymentTimelineIdx: index(
      "order_payments_seller_timeline_idx",
    ).on(
      table.sellerId,
      table.paymentStatus,
      table.paidAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Order Timeline
     * ------------------------------------------------------------------------
     */

    orderPaymentTimelineIdx: index(
      "order_payments_order_timeline_idx",
    ).on(
      table.orderId,
      table.paymentStatus,
      table.paidAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Revenue Analytics
     * ------------------------------------------------------------------------
     */

    revenueTimelineIdx: index(
      "order_payments_revenue_timeline_idx",
    ).on(
      table.paymentStatus,
      table.capturedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Settlement
     * ------------------------------------------------------------------------
     */

    settlementTimelineIdx: index(
      "order_payments_settlement_timeline_idx",
    ).on(
      table.paymentGateway,
      table.capturedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Failed Payments
     * ------------------------------------------------------------------------
     */

    failedPaymentTimelineIdx: index(
      "order_payments_failed_timeline_idx",
    ).on(
      table.paymentStatus,
      table.failedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Expired Payments
     * ------------------------------------------------------------------------
     */

    expiredPaymentTimelineIdx: index(
      "order_payments_expired_timeline_idx",
    ).on(
      table.paymentStatus,
      table.expiredAt,
    ),

        /**
     * ------------------------------------------------------------------------
     * Customer
     * ------------------------------------------------------------------------
     */

    payerEmailIdx: index(
      "order_payments_payer_email_idx",
    ).on(table.payerEmail),

    payerPhoneIdx: index(
      "order_payments_payer_phone_idx",
    ).on(table.payerPhone),

    /**
     * ------------------------------------------------------------------------
     * Gateway Investigation
     * ------------------------------------------------------------------------
     */

    gatewayFailureIdx: index(
      "order_payments_gateway_failure_idx",
    ).on(
      table.paymentGateway,
      table.failureReason,
    ),

    /**
     * ------------------------------------------------------------------------
     * Audit
     * ------------------------------------------------------------------------
     */

    createdAtIdx: index(
      "order_payments_created_at_idx",
    ).on(table.createdAt),

    updatedAtIdx: index(
      "order_payments_updated_at_idx",
    ).on(table.updatedAt),

    deletedAtIdx: index(
      "order_payments_deleted_at_idx",
    ).on(table.deletedAt),

    /**
     * ------------------------------------------------------------------------
     * Seller Dashboard
     * ------------------------------------------------------------------------
     */

    sellerDashboardIdx: index(
      "order_payments_seller_dashboard_idx",
    ).on(
      table.sellerId,
      table.paymentStatus,
      table.createdAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Order Details
     * ------------------------------------------------------------------------
     */

    orderPaymentsTimelineIdx: index(
      "order_payments_order_detail_idx",
    ).on(
      table.orderId,
      table.createdAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Revenue Reports
     * ------------------------------------------------------------------------
     */

    revenueReportIdx: index(
      "order_payments_revenue_report_idx",
    ).on(
      table.paymentStatus,
      table.amount,
      table.createdAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Settlement
     * ------------------------------------------------------------------------
     */

    settlementIdx: index(
      "order_payments_settlement_idx",
    ).on(
      table.paymentGateway,
      table.paymentStatus,
      table.capturedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Refund Lookup
     * ------------------------------------------------------------------------
     */

    refundLookupIdx: index(
      "order_payments_refund_lookup_idx",
    ).on(
      table.orderId,
      table.paymentStatus,
      table.transactionId,
    ),

    /**
     * ------------------------------------------------------------------------
     * Financial Reconciliation
     * ------------------------------------------------------------------------
     */

    reconciliationIdx: index(
      "order_payments_reconciliation_idx",
    ).on(
      table.paymentGateway,
      table.gatewayPaymentId,
      table.transactionId,
    ),

    /**
     * ------------------------------------------------------------------------
     * Active Payments
     * ------------------------------------------------------------------------
     */

    activePaymentIdx: index(
      "order_payments_active_idx",
    ).on(
      table.deletedAt,
      table.paymentStatus,
    ),

  }),
);
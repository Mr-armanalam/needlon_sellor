// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/table.ts
// Description: Orders table
// Phase: 6.1.4.1 - Foundation
// ============================================================================

import {
  boolean,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import {
  orderPriorityEnum,
  orderSourceEnum,
  orderStatusEnum,
  paymentMethodEnum,
  paymentStatusEnum,
  shippingMethodEnum,
} from "./constants";

import { seller } from "@/db/schema/seller";
import { sellerStore } from "@/db/schema/seller/seller-store";
import { usersTable } from "@/db/schema/users";
import { sellerAddresses } from "@/db/schema/seller/seller-address";

/**
 * ============================================================================
 * Orders
 * ============================================================================
 *
 * Root table representing a customer's order.
 *
 * Child Tables
 *
 * • order_items
 * • order_status_history
 * • order_shipments
 * • order_payments
 * • order_returns
 * • order_refunds
 *
 * ============================================================================
 *
 * Seller
 *      │
 *      ▼
 * Order
 *      │
 *      ├────────► Items
 *      ├────────► Shipment
 *      ├────────► Payment
 *      ├────────► Status History
 *      ├────────► Return
 *      └────────► Refund
 *
 * ============================================================================
 */

export const orders = pgTable(
  "product_orders",
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
     * Seller
     * ------------------------------------------------------------------------
     */

    sellerId: uuid("seller_id")
      .notNull()
      .references(() => seller.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),

    /**
     * ------------------------------------------------------------------------
     * Buyer
     * ------------------------------------------------------------------------
     */

    buyerId: uuid("buyer_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),

    /**
     * ------------------------------------------------------------------------
     * Store
     * ------------------------------------------------------------------------
     */

    storeId: uuid("store_id")
      .notNull()
      .references(() => sellerStore.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),

    /**
     * ------------------------------------------------------------------------
     * Shipping Address
     * ------------------------------------------------------------------------
     */

    shippingAddressId: uuid(
      "shipping_address_id",
    )
      .notNull()
      .references(() => sellerAddresses.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),

    /**
     * ------------------------------------------------------------------------
     * Billing Address
     * ------------------------------------------------------------------------
     */

    billingAddressId: uuid(
      "billing_address_id",
    ).references(() => sellerAddresses.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),

    // ---------------------------------------------------------------------
    // Remaining columns implemented in:
    //
    // Phase 6.1.4.2
    // Order Information
    //

        /**
     * ------------------------------------------------------------------------
     * Order Information
     * ------------------------------------------------------------------------
     */

    orderNumber: varchar(
      "order_number",
      {
        length: 100,
      },
    ).notNull(),

    /**
     * ------------------------------------------------------------------------
     * Order Status
     * ------------------------------------------------------------------------
     */

    status: orderStatusEnum(
      "status",
    )
      .notNull()
      .default("PENDING"),

    /**
     * ------------------------------------------------------------------------
     * Payment Status
     * ------------------------------------------------------------------------
     */

    paymentStatus:
      paymentStatusEnum(
        "payment_status",
      )
        .notNull()
        .default("PENDING"),

    /**
     * ------------------------------------------------------------------------
     * Payment Method
     * ------------------------------------------------------------------------
     */

    paymentMethod:
      paymentMethodEnum(
        "payment_method",
      )
        .notNull()
        .default("COD"),

    /**
     * ------------------------------------------------------------------------
     * Shipping Method
     * ------------------------------------------------------------------------
     */

    shippingMethod:
      shippingMethodEnum(
        "shipping_method",
      )
        .notNull()
        .default("STANDARD"),

    /**
     * ------------------------------------------------------------------------
     * Order Priority
     * ------------------------------------------------------------------------
     */

    priority:
      orderPriorityEnum(
        "priority",
      )
        .notNull()
        .default("NORMAL"),

    /**
     * ------------------------------------------------------------------------
     * Order Source
     * ------------------------------------------------------------------------
     */

    source:
      orderSourceEnum(
        "source",
      )
        .notNull()
        .default("WEB"),

    /**
     * ------------------------------------------------------------------------
     * Currency
     * ------------------------------------------------------------------------
     */

    currency: varchar(
      "currency",
      {
        length: 10,
      },
    )
      .notNull()
      .default("INR"),

    // Phase 6.1.4.3
    // Buyer Snapshot
    // Financial Summary
    // Business Flags
    //

        /**
     * ------------------------------------------------------------------------
     * Buyer Snapshot
     * ------------------------------------------------------------------------
     *
     * Snapshot values are stored to preserve
     * order history even if the buyer updates
     * their profile later.
     * ------------------------------------------------------------------------
     */

    buyerName: varchar(
      "buyer_name",
      {
        length: 255,
      },
    ).notNull(),

    buyerEmail: varchar(
      "buyer_email",
      {
        length: 320,
      },
    ).notNull(),

    buyerPhone: varchar(
      "buyer_phone",
      {
        length: 20,
      },
    ).notNull(),

    /**
     * ------------------------------------------------------------------------
     * Financial Summary
     * ------------------------------------------------------------------------
     */

    subtotal: numeric(
      "subtotal",
      {
        precision: 18,
        scale: 2,
      },
    ).notNull(),

    discountAmount: numeric(
      "discount_amount",
      {
        precision: 18,
        scale: 2,
      },
    )
      .notNull()
      .default("0"),

    couponDiscount: numeric(
      "coupon_discount",
      {
        precision: 18,
        scale: 2,
      },
    )
      .notNull()
      .default("0"),

    shippingCharge: numeric(
      "shipping_charge",
      {
        precision: 18,
        scale: 2,
      },
    )
      .notNull()
      .default("0"),

    taxAmount: numeric(
      "tax_amount",
      {
        precision: 18,
        scale: 2,
      },
    )
      .notNull()
      .default("0"),

    grandTotal: numeric(
      "grand_total",
      {
        precision: 18,
        scale: 2,
      },
    ).notNull(),

    /**
     * ------------------------------------------------------------------------
     * Business Flags
     * ------------------------------------------------------------------------
     */

    isGift: boolean(
      "is_gift",
    )
      .notNull()
      .default(false),

    giftMessage: text(
      "gift_message",
    ),

    requiresSignature: boolean(
      "requires_signature",
    )
      .notNull()
      .default(false),

    /**
     * ------------------------------------------------------------------------
     * Seller Remarks
     * ------------------------------------------------------------------------
     */

    sellerRemark: text(
      "seller_remark",
    ),

    internalRemark: text(
      "internal_remark",
    ),

    // Phase 6.1.4.4
    // Lifecycle
    // Timeline
    //

        /**
     * ------------------------------------------------------------------------
     * Delivery Timeline
     * ------------------------------------------------------------------------
     */

    expectedDeliveryDate: timestamp(
      "expected_delivery_date",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    actualDeliveryDate: timestamp(
      "actual_delivery_date",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    /**
     * ------------------------------------------------------------------------
     * Order Lifecycle
     * ------------------------------------------------------------------------
     */

    acceptedAt: timestamp(
      "accepted_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    packedAt: timestamp(
      "packed_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    readyAt: timestamp(
      "ready_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    shippedAt: timestamp(
      "shipped_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    deliveredAt: timestamp(
      "delivered_at",
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

    returnedAt: timestamp(
      "returned_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    // Phase 6.1.4.5
    // Audit
    // Metadata
    // Production Indexes
    // ---------------------------------------------------------------------

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
     * Primary Relationships
     * ------------------------------------------------------------------------
     */

    sellerIdx: index(
      "orders_seller_idx",
    ).on(table.sellerId),

    buyerIdx: index(
      "orders_buyer_idx",
    ).on(table.buyerId),

    storeIdx: index(
      "orders_store_idx",
    ).on(table.storeId),

    shippingAddressIdx: index(
      "orders_shipping_address_idx",
    ).on(table.shippingAddressId),

    billingAddressIdx: index(
      "orders_billing_address_idx",
    ).on(table.billingAddressId),

    /**
     * ------------------------------------------------------------------------
     * Seller Dashboard
     * ------------------------------------------------------------------------
     */

    sellerStoreIdx: index(
      "orders_seller_store_idx",
    ).on(
      table.sellerId,
      table.storeId,
    ),

    /**
     * ------------------------------------------------------------------------
     * Buyer Dashboard
     * ------------------------------------------------------------------------
     */

    buyerStoreIdx: index(
      "orders_buyer_store_idx",
    ).on(
      table.buyerId,
      table.storeId,
    ),

    /**
     * ------------------------------------------------------------------------
     * Store Analytics
     * ------------------------------------------------------------------------
     */

    sellerBuyerIdx: index(
      "orders_seller_buyer_idx",
    ).on(
      table.sellerId,
      table.buyerId,
    ),

        /**
     * ------------------------------------------------------------------------
     * Order Information
     * ------------------------------------------------------------------------
     */

    orderNumberIdx: index(
      "orders_order_number_idx",
    ).on(
      table.orderNumber,
    ),

    statusIdx: index(
      "orders_status_idx",
    ).on(
      table.status,
    ),

    paymentStatusIdx: index(
      "orders_payment_status_idx",
    ).on(
      table.paymentStatus,
    ),

    paymentMethodIdx: index(
      "orders_payment_method_idx",
    ).on(
      table.paymentMethod,
    ),

    shippingMethodIdx: index(
      "orders_shipping_method_idx",
    ).on(
      table.shippingMethod,
    ),

    priorityIdx: index(
      "orders_priority_idx",
    ).on(
      table.priority,
    ),

    sourceIdx: index(
      "orders_source_idx",
    ).on(
      table.source,
    ),

    currencyIdx: index(
      "orders_currency_idx",
    ).on(
      table.currency,
    ),

    /**
     * ------------------------------------------------------------------------
     * Seller Dashboard
     * ------------------------------------------------------------------------
     */

    sellerStatusIdx: index(
      "orders_seller_status_idx",
    ).on(
      table.sellerId,
      table.status,
    ),

    sellerPaymentStatusIdx: index(
      "orders_seller_payment_status_idx",
    ).on(
      table.sellerId,
      table.paymentStatus,
    ),

    sellerPriorityIdx: index(
      "orders_seller_priority_idx",
    ).on(
      table.sellerId,
      table.priority,
    ),

    /**
     * ------------------------------------------------------------------------
     * Buyer Dashboard
     * ------------------------------------------------------------------------
     */

    buyerStatusIdx: index(
      "orders_buyer_status_idx",
    ).on(
      table.buyerId,
      table.status,
    ),

    /**
     * ------------------------------------------------------------------------
     * Operational Queries
     * ------------------------------------------------------------------------
     */

    orderStatusPriorityIdx: index(
      "orders_status_priority_idx",
    ).on(
      table.status,
      table.priority,
    ),

    paymentWorkflowIdx: index(
      "orders_payment_workflow_idx",
    ).on(
      table.paymentStatus,
      table.paymentMethod,
    ),

    shippingWorkflowIdx: index(
      "orders_shipping_workflow_idx",
    ).on(
      table.shippingMethod,
      table.status,
    ),

    sourceAnalyticsIdx: index(
      "orders_source_analytics_idx",
    ).on(
      table.source,
      table.status,
    ),

        /**
     * ------------------------------------------------------------------------
     * Buyer Snapshot
     * ------------------------------------------------------------------------
     */

    buyerNameIdx: index(
      "orders_buyer_name_idx",
    ).on(
      table.buyerName,
    ),

    buyerEmailIdx: index(
      "orders_buyer_email_idx",
    ).on(
      table.buyerEmail,
    ),

    buyerPhoneIdx: index(
      "orders_buyer_phone_idx",
    ).on(
      table.buyerPhone,
    ),

    /**
     * ------------------------------------------------------------------------
     * Financial Reporting
     * ------------------------------------------------------------------------
     */

    subtotalIdx: index(
      "orders_subtotal_idx",
    ).on(
      table.subtotal,
    ),

    grandTotalIdx: index(
      "orders_grand_total_idx",
    ).on(
      table.grandTotal,
    ),

    sellerRevenueIdx: index(
      "orders_seller_revenue_idx",
    ).on(
      table.sellerId,
      table.grandTotal,
    ),

    /**
     * ------------------------------------------------------------------------
     * Gift Orders
     * ------------------------------------------------------------------------
     */

    giftOrdersIdx: index(
      "orders_gift_idx",
    ).on(
      table.isGift,
    ),

    /**
     * ------------------------------------------------------------------------
     * Signature Required
     * ------------------------------------------------------------------------
     */

    signatureOrdersIdx: index(
      "orders_signature_idx",
    ).on(
      table.requiresSignature,
    ),

    /**
     * ------------------------------------------------------------------------
     * Financial Dashboard
     * ------------------------------------------------------------------------
     */

    sellerFinancialDashboardIdx: index(
      "orders_seller_financial_dashboard_idx",
    ).on(
      table.sellerId,
      table.status,
      table.grandTotal,
    ),

    paymentRevenueIdx: index(
      "orders_payment_revenue_idx",
    ).on(
      table.paymentStatus,
      table.grandTotal,
    ),

        /**
     * ------------------------------------------------------------------------
     * Delivery
     * ------------------------------------------------------------------------
     */

    expectedDeliveryIdx: index(
      "orders_expected_delivery_idx",
    ).on(
      table.expectedDeliveryDate,
    ),

    actualDeliveryIdx: index(
      "orders_actual_delivery_idx",
    ).on(
      table.actualDeliveryDate,
    ),

    /**
     * ------------------------------------------------------------------------
     * Lifecycle
     * ------------------------------------------------------------------------
     */

    acceptedAtIdx: index(
      "orders_accepted_at_idx",
    ).on(
      table.acceptedAt,
    ),

    packedAtIdx: index(
      "orders_packed_at_idx",
    ).on(
      table.packedAt,
    ),

    readyAtIdx: index(
      "orders_ready_at_idx",
    ).on(
      table.readyAt,
    ),

    shippedAtIdx: index(
      "orders_shipped_at_idx",
    ).on(
      table.shippedAt,
    ),

    deliveredAtIdx: index(
      "orders_delivered_at_idx",
    ).on(
      table.deliveredAt,
    ),

    cancelledAtIdx: index(
      "orders_cancelled_at_idx",
    ).on(
      table.cancelledAt,
    ),

    returnedAtIdx: index(
      "orders_returned_at_idx",
    ).on(
      table.returnedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Seller Dashboard
     * ------------------------------------------------------------------------
     */

    sellerTimelineIdx: index(
      "orders_seller_timeline_idx",
    ).on(
      table.sellerId,
      table.status,
      table.createdAt,
    ),

    sellerDeliveryIdx: index(
      "orders_seller_delivery_idx",
    ).on(
      table.sellerId,
      table.expectedDeliveryDate,
    ),

    /**
     * ------------------------------------------------------------------------
     * Buyer Dashboard
     * ------------------------------------------------------------------------
     */

    buyerTimelineIdx: index(
      "orders_buyer_timeline_idx",
    ).on(
      table.buyerId,
      table.status,
      table.createdAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Shipping Operations
     * ------------------------------------------------------------------------
     */

    shippingQueueIdx: index(
      "orders_shipping_queue_idx",
    ).on(
      table.status,
      table.readyAt,
      table.shippingMethod,
    ),

    deliveryQueueIdx: index(
      "orders_delivery_queue_idx",
    ).on(
      table.status,
      table.shippedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Analytics
     * ------------------------------------------------------------------------
     */

    deliveryAnalyticsIdx: index(
      "orders_delivery_analytics_idx",
    ).on(
      table.deliveredAt,
      table.status,
    ),

    returnAnalyticsIdx: index(
      "orders_return_analytics_idx",
    ).on(
      table.returnedAt,
      table.status,
    ),

    cancellationAnalyticsIdx: index(
      "orders_cancellation_analytics_idx",
    ).on(
      table.cancelledAt,
      table.status,
    ),

        /**
     * ------------------------------------------------------------------------
     * Audit
     * ------------------------------------------------------------------------
     */

    createdAtIdx: index(
      "orders_created_at_idx",
    ).on(
      table.createdAt,
    ),

    updatedAtIdx: index(
      "orders_updated_at_idx",
    ).on(
      table.updatedAt,
    ),

    deletedAtIdx: index(
      "orders_deleted_at_idx",
    ).on(
      table.deletedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Order Dashboard
     * ------------------------------------------------------------------------
     */

    sellerDashboardIdx: index(
      "orders_seller_dashboard_idx",
    ).on(
      table.sellerId,
      table.status,
      table.createdAt,
    ),

    buyerDashboardIdx: index(
      "orders_buyer_dashboard_idx",
    ).on(
      table.buyerId,
      table.status,
      table.createdAt,
    ),

    storeDashboardIdx: index(
      "orders_store_dashboard_idx",
    ).on(
      table.storeId,
      table.status,
      table.createdAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Revenue Dashboard
     * ------------------------------------------------------------------------
     */

    revenueDashboardIdx: index(
      "orders_revenue_dashboard_idx",
    ).on(
      table.paymentStatus,
      table.grandTotal,
      table.createdAt,
    ),

    sellerRevenueTimelineIdx: index(
      "orders_seller_revenue_timeline_idx",
    ).on(
      table.sellerId,
      table.paymentStatus,
      table.createdAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Search
     * ------------------------------------------------------------------------
     */

    orderSearchIdx: index(
      "orders_search_idx",
    ).on(
      table.orderNumber,
      table.buyerName,
    ),

    orderLookupIdx: index(
      "orders_lookup_idx",
    ).on(
      table.orderNumber,
      table.sellerId,
    ),

    /**
     * ------------------------------------------------------------------------
     * Operational Queue
     * ------------------------------------------------------------------------
     */

    pendingOrdersIdx: index(
      "orders_pending_idx",
    ).on(
      table.status,
      table.priority,
      table.createdAt,
    ),

    processingOrdersIdx: index(
      "orders_processing_idx",
    ).on(
      table.status,
      table.paymentStatus,
      table.createdAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Financial Analytics
     * ------------------------------------------------------------------------
     */

    financialAnalyticsIdx: index(
      "orders_financial_analytics_idx",
    ).on(
      table.createdAt,
      table.grandTotal,
      table.currency,
    ),

    /**
     * ------------------------------------------------------------------------
     * Soft Delete
     * ------------------------------------------------------------------------
     */

    activeOrdersIdx: index(
      "orders_active_idx",
    ).on(
      table.deletedAt,
      table.status,
    ),

    /**
     * ------------------------------------------------------------------------
     * Seller Performance
     * ------------------------------------------------------------------------
     */

    sellerPerformanceIdx: index(
      "orders_seller_performance_idx",
    ).on(
      table.sellerId,
      table.status,
      table.deliveredAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Buyer Activity
     * ------------------------------------------------------------------------
     */

    buyerActivityIdx: index(
      "orders_buyer_activity_idx",
    ).on(
      table.buyerId,
      table.createdAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Store Analytics
     * ------------------------------------------------------------------------
     */

    storeAnalyticsIdx: index(
      "orders_store_analytics_idx",
    ).on(
      table.storeId,
      table.createdAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Monthly Reports
     * ------------------------------------------------------------------------
     */

    monthlySalesIdx: index(
      "orders_monthly_sales_idx",
    ).on(
      table.createdAt,
      table.paymentStatus,
      table.grandTotal,
    ),

  }),
);
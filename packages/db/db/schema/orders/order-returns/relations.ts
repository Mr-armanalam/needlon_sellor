// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-returns/relations.ts
// Description: Order Return relations
// Phase: 6.6.5
// ============================================================================

import { relations } from "drizzle-orm";

import { orderReturns } from "./table";

import { orders } from "../table";

import { orderItems } from "../order-items/table";

import { orderShipments } from "../order-shipments/table";

import { orderPayments } from "../order-payments/table";

import { seller } from "@/db/schema/seller";
import { orderRefunds } from "../order-refunds/table";

/**
 * ============================================================================
 * Order Return Relations
 * ============================================================================
 *
 * Parent
 *
 * orders
 *      │
 *      ▼
 * order_returns
 *
 * Optional Parents
 *
 * order_items
 * order_shipments
 * order_payments
 *
 * Child
 *
 * order_refunds
 *
 * ============================================================================
 *
 * One Order
 *      │
 *      ├────────► Return #1
 *      ├────────► Return #2
 *      └────────► Return #3
 *
 * A return may belong to:
 *
 * • Entire Order
 * • Single Order Item
 * • Shipment
 * • Payment
 *
 * Each return can produce
 * one or more refunds.
 *
 * ============================================================================
 */

export const orderReturnsRelations = relations(
  orderReturns,
  ({ one, many }) => ({
    /**
     * ------------------------------------------------------------------------
     * Parent Order
     * ------------------------------------------------------------------------
     */

    order: one(orders, {
      fields: [orderReturns.orderId],
      references: [orders.id],
    }),

    /**
     * ------------------------------------------------------------------------
     * Order Item
     * ------------------------------------------------------------------------
     *
     * Nullable because an entire order
     * may be returned.
     */

    orderItem: one(orderItems, {
      fields: [orderReturns.orderItemId],
      references: [orderItems.id],
    }),

    /**
     * ------------------------------------------------------------------------
     * Shipment
     * ------------------------------------------------------------------------
     */

    shipment: one(orderShipments, {
      fields: [orderReturns.shipmentId],
      references: [orderShipments.id],
    }),

    /**
     * ------------------------------------------------------------------------
     * Payment
     * ------------------------------------------------------------------------
     */

    payment: one(orderPayments, {
      fields: [orderReturns.paymentId],
      references: [orderPayments.id],
    }),

    /**
     * ------------------------------------------------------------------------
     * Seller
     * ------------------------------------------------------------------------
     */

    seller: one(seller, {
      fields: [orderReturns.sellerId],
      references: [seller.id],
    }),

    /**
     * ------------------------------------------------------------------------
     * Refunds
     * ------------------------------------------------------------------------
     *
     * One Return
     *      │
     *      ├────────► Partial Refund
     *      ├────────► Final Refund
     *      └────────► Multiple Refund Attempts
     *
     * Supports:
     *
     * • Full Refunds
     * • Partial Refunds
     * • Multiple Refund Transactions
     * • Gateway Retry
     * • Financial Reconciliation
     */

    refunds: many(orderRefunds),
  }),
);
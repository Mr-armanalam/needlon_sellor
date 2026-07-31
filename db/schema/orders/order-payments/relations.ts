// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-payments/relations.ts
// Description: Order Payment relations
// Phase: 6.5.5
// ============================================================================

import { relations } from "drizzle-orm";

import { orderPayments } from "./table";

import { orders } from "../table";

import { seller } from "@/db/schema/seller";
import { orderRefunds } from "../order-refunds/table";

/**
 * ============================================================================
 * Order Payment Relations
 * ============================================================================
 *
 * Parent
 *
 * orders
 *      │
 *      ▼
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
 *      ├────────► Payment Attempt #1
 *      ├────────► Payment Attempt #2
 *      └────────► Payment Attempt #3
 *
 * Each payment may later produce
 * one or more refunds.
 *
 * ============================================================================
 */

export const orderPaymentsRelations = relations(
  orderPayments,
  ({ one, many }) => ({
    /**
     * ------------------------------------------------------------------------
     * Parent Order
     * ------------------------------------------------------------------------
     */

    order: one(orders, {
      fields: [orderPayments.orderId],
      references: [orders.id],
    }),

    /**
     * ------------------------------------------------------------------------
     * Seller
     * ------------------------------------------------------------------------
     *
     * Seller associated with this payment.
     */

    seller: one(seller, {
      fields: [orderPayments.sellerId],
      references: [seller.id],
    }),

    /**
     * ------------------------------------------------------------------------
     * Refunds
     * ------------------------------------------------------------------------
     *
     * One payment
     *      │
     *      ├────────► Full Refund
     *      │
     *      ├────────► Partial Refund
     *      │
     *      └────────► Multiple Refunds
     *
     * Enables:
     *
     * • Partial Refunds
     * • Multiple Refund Attempts
     * • Gateway Refund Tracking
     * • Financial Reconciliation
     */

    refunds: many(orderRefunds),
  }),
);
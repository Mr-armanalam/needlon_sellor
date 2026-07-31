// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-refunds/relations.ts
// Description: Order Refund relations
// Phase: 6.7.5
// ============================================================================

import { relations } from "drizzle-orm";

import { orderRefunds } from "./table";

import { orders } from "../table";

import { orderReturns } from "../order-returns/table";

import { orderPayments } from "../order-payments/table";

import { seller } from "@/db/schema/seller";

/**
 * ============================================================================
 * Order Refund Relations
 * ============================================================================
 *
 * Parent Relationships
 *
 * orders
 *      │
 *      ▼
 * order_refunds
 *
 * Optional Parents
 *
 * order_returns
 * order_payments
 *
 * ============================================================================
 *
 * One Order
 *      │
 *      ├────────► Refund #1
 *      ├────────► Refund #2
 *      └────────► Refund #3
 *
 * Refund Sources
 *
 * • Order Cancellation
 * • Approved Return
 * • Partial Return
 * • Manual Refund
 * • Goodwill Adjustment
 *
 * One Payment
 *      │
 *      ├────────► Partial Refund
 *      ├────────► Shipping Refund
 *      └────────► Final Refund
 *
 * ============================================================================
 */

export const orderRefundsRelations = relations(
  orderRefunds,
  ({ one }) => ({
    /**
     * ------------------------------------------------------------------------
     * Parent Order
     * ------------------------------------------------------------------------
     */

    order: one(orders, {
      fields: [
        orderRefunds.orderId,
      ],
      references: [
        orders.id,
      ],
    }),

    /**
     * ------------------------------------------------------------------------
     * Return
     * ------------------------------------------------------------------------
     *
     * Nullable because not every refund
     * originates from a return.
     */

    orderReturn: one(
      orderReturns,
      {
        fields: [
          orderRefunds.orderReturnId,
        ],
        references: [
          orderReturns.id,
        ],
      },
    ),

    /**
     * ------------------------------------------------------------------------
     * Original Payment
     * ------------------------------------------------------------------------
     */

    payment: one(
      orderPayments,
      {
        fields: [
          orderRefunds.paymentId,
        ],
        references: [
          orderPayments.id,
        ],
      },
    ),

    /**
     * ------------------------------------------------------------------------
     * Seller
     * ------------------------------------------------------------------------
     */

    seller: one(seller, {
      fields: [
        orderRefunds.sellerId,
      ],
      references: [
        seller.id,
      ],
    }),
  }),
);
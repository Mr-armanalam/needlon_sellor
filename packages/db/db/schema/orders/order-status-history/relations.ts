// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-status-history/relations.ts
// Description: Order Status History relations
// Phase: 6.3.5
// ============================================================================

import { relations } from "drizzle-orm";

import { orderStatusHistory } from "./table";

import { orders } from "../table";

import { seller } from "@/db/schema/seller";
import { usersTable } from "@/db/schema/users";

/**
 * ============================================================================
 * Order Status History Relations
 * ============================================================================
 *
 * Parent
 *
 * orders
 *      │
 *      ▼
 * order_status_history
 *
 * ============================================================================
 *
 * This table is an immutable append-only audit log.
 *
 * Every status transition inserts a new record.
 *
 * Existing records are NEVER modified.
 *
 * ============================================================================
 */

export const orderStatusHistoryRelations = relations(
  orderStatusHistory,
  ({ one }) => ({
    /**
     * ------------------------------------------------------------------------
     * Parent Order
     * ------------------------------------------------------------------------
     */

    order: one(orders, {
      fields: [orderStatusHistory.orderId],
      references: [orders.id],
    }),

    /**
     * ------------------------------------------------------------------------
     * Seller
     * ------------------------------------------------------------------------
     */

    seller: one(seller, {
      fields: [orderStatusHistory.sellerId],
      references: [seller.id],
    }),

    /**
     * ------------------------------------------------------------------------
     * Changed By User
     * ------------------------------------------------------------------------
     *
     * User responsible for this transition.
     *
     * May be NULL for automated transitions
     * such as:
     *
     * • Payment Gateway
     * • Webhook
     * • Scheduled Job
     * • System Automation
     */

    changedByUser: one(usersTable, {
      fields: [orderStatusHistory.changedByUserId],
      references: [usersTable.id],
      relationName: "order_status_changed_by",
    }),
  }),
);
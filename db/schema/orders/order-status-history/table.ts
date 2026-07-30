// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-status-history/table.ts
// Description: Order Status History table
// Phase: 6.3.4.1 - Foundation
// ============================================================================

import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { orders } from "../table";

import { seller } from "@/db/schema/seller";
import { usersTable } from "@/db/schema/users";
import {
  orderStatusActionEnum,
  orderStatusResultEnum,
  orderStatusSourceEnum,
} from "./constants";
import { orderStatusEnum } from "../constants";



/**
 * ============================================================================
 * Order Status History
 * ============================================================================
 *
 * Immutable audit log.
 *
 * Every status transition creates a NEW row.
 *
 * Existing rows are NEVER updated or deleted.
 *
 * Example
 *
 * Order
 *
 * PENDING
 *      │
 *      ▼
 * CONFIRMED
 *      │
 *      ▼
 * PACKED
 *      │
 *      ▼
 * SHIPPED
 *      │
 *      ▼
 * DELIVERED
 *
 * ============================================================================
 */

export const orderStatusHistory = pgTable(
  "order_status_history",
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
     * Seller that owns the order.
     */

    sellerId: uuid("seller_id")
      .notNull()
      .references(() => seller.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),

    /**
     * ------------------------------------------------------------------------
     * Changed By
     * ------------------------------------------------------------------------
     *
     * User responsible for this transition.
     *
     * Nullable because some transitions may be
     * executed automatically by the system.
     */

    changedByUserId: uuid("changed_by_user_id")
      .references(() => usersTable.id, {
        onDelete: "set null",
        onUpdate: "cascade",
      }),

    // ---------------------------------------------------------------------
    // Remaining columns implemented in:
    //
    // Phase 6.3.4.2
    // Status Transition
    
        /**
     * ------------------------------------------------------------------------
     * Status Transition
     * ------------------------------------------------------------------------
     *
     * Every row records one immutable state transition.
     *
     * Examples
     *
     * PENDING
     *      ↓
     * CONFIRMED
     *
     * CONFIRMED
     *      ↓
     * PACKED
     *
     * PACKED
     *      ↓
     * SHIPPED
     *
     * SHIPPED
     *      ↓
     * DELIVERED
     * ------------------------------------------------------------------------
     */

    fromStatus: orderStatusEnum("from_status"),

    toStatus: orderStatusEnum("to_status")
      .notNull(),

    /**
     * ------------------------------------------------------------------------
     * Transition Action
     * ------------------------------------------------------------------------
     *
     * Business event that caused this transition.
     * ------------------------------------------------------------------------
     */

    action: orderStatusActionEnum("action")
      .notNull(),

    /**
     * ------------------------------------------------------------------------
     * Transition Source
     * ------------------------------------------------------------------------
     *
     * Who or what initiated the transition.
     * ------------------------------------------------------------------------
     */

    source: orderStatusSourceEnum("source")
      .notNull()
      .default("SYSTEM"),

    /**
     * ------------------------------------------------------------------------
     * Transition Result
     * ------------------------------------------------------------------------
     *
     * Outcome of the transition request.
     * ------------------------------------------------------------------------
     */

    result: orderStatusResultEnum("result")
      .notNull()
      .default("SUCCESS"),

    // Phase 6.3.4.3
    // Transition Metadata
    
        /**
     * ------------------------------------------------------------------------
     * Transition Details
     * ------------------------------------------------------------------------
     *
     * Human-readable information describing why the transition occurred.
     * These fields are immutable and are primarily used for customer support,
     * auditing, and operational troubleshooting.
     * ------------------------------------------------------------------------
     */

    reason: varchar("reason", {
      length: 1000,
    }),

    remarks: text("remarks"),

    /**
     * ------------------------------------------------------------------------
     * Reference Information
     * ------------------------------------------------------------------------
     *
     * External or internal identifier associated with this transition.
     *
     * Examples
     *
     * Payment Transaction ID
     * Shipment ID
     * Return Request ID
     * Refund ID
     * Admin Ticket ID
     * Webhook Event ID
     * ------------------------------------------------------------------------
     */

    referenceId: varchar("reference_id", {
      length: 255,
    }),

    /**
     * ------------------------------------------------------------------------
     * Request Metadata
     * ------------------------------------------------------------------------
     *
     * Useful for security audits and debugging.
     * ------------------------------------------------------------------------
     */

    ipAddress: varchar("ip_address", {
      length: 45,
    }),

    userAgent: text("user_agent"),

    // Phase 6.3.4.4
    // Audit
    // Production Indexes
    // ---------------------------------------------------------------------

        /**
     * ------------------------------------------------------------------------
     * Audit
     * ------------------------------------------------------------------------
     *
     * This module is append-only.
     *
     * Every status transition inserts a NEW row.
     *
     * Existing rows are NEVER updated.
     * ------------------------------------------------------------------------
     */

    changedAt: timestamp("changed_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
},
  

  (table) => ({
    /**
     * ------------------------------------------------------------------------
     * Foundation Indexes
     * ------------------------------------------------------------------------
     */

    orderIdx: index(
      "order_status_history_order_idx",
    ).on(table.orderId),

    sellerIdx: index(
      "order_status_history_seller_idx",
    ).on(table.sellerId),

    changedByUserIdx: index(
      "order_status_history_changed_by_user_idx",
    ).on(table.changedByUserId),

    /**
     * ------------------------------------------------------------------------
     * Dashboard Lookup
     * ------------------------------------------------------------------------
     */

    orderSellerIdx: index(
      "order_status_history_order_seller_idx",
    ).on(
      table.orderId,
      table.sellerId,
    ),

        /**
     * ------------------------------------------------------------------------
     * Status Transition
     * ------------------------------------------------------------------------
     */

    fromStatusIdx: index(
      "order_status_history_from_status_idx",
    ).on(table.fromStatus),

    toStatusIdx: index(
      "order_status_history_to_status_idx",
    ).on(table.toStatus),

    actionIdx: index(
      "order_status_history_action_idx",
    ).on(table.action),

    sourceIdx: index(
      "order_status_history_source_idx",
    ).on(table.source),

    resultIdx: index(
      "order_status_history_result_idx",
    ).on(table.result),

    /**
     * ------------------------------------------------------------------------
     * Dashboard & Timeline
     * ------------------------------------------------------------------------
     */

    orderTransitionIdx: index(
      "order_status_history_order_transition_idx",
    ).on(
      table.orderId,
      table.toStatus,
    ),

    sellerTransitionIdx: index(
      "order_status_history_seller_transition_idx",
    ).on(
      table.sellerId,
      table.toStatus,
    ),

    actionSourceIdx: index(
      "order_status_history_action_source_idx",
    ).on(
      table.action,
      table.source,
    ),

        /**
     * ------------------------------------------------------------------------
     * Timeline
     * ------------------------------------------------------------------------
     */

    changedAtIdx: index(
      "order_status_history_changed_at_idx",
    ).on(table.changedAt),

    createdAtIdx: index(
      "order_status_history_created_at_idx",
    ).on(table.createdAt),

    /**
     * ------------------------------------------------------------------------
     * Order Timeline
     * ------------------------------------------------------------------------
     */

    orderTimelineIdx: index(
      "order_status_history_order_timeline_idx",
    ).on(
      table.orderId,
      table.changedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Seller Timeline
     * ------------------------------------------------------------------------
     */

    sellerTimelineIdx: index(
      "order_status_history_seller_timeline_idx",
    ).on(
      table.sellerId,
      table.changedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * User Activity
     * ------------------------------------------------------------------------
     */

    changedByTimelineIdx: index(
      "order_status_history_changed_by_timeline_idx",
    ).on(
      table.changedByUserId,
      table.changedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Latest Status Lookup
     * ------------------------------------------------------------------------
     */

    latestStatusIdx: index(
      "order_status_history_latest_status_idx",
    ).on(
      table.orderId,
      table.changedAt,
      table.toStatus,
    ),

    /**
     * ------------------------------------------------------------------------
     * Seller Dashboard
     * ------------------------------------------------------------------------
     */

    sellerStatusTimelineIdx: index(
      "order_status_history_seller_status_timeline_idx",
    ).on(
      table.sellerId,
      table.toStatus,
      table.changedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Analytics
     * ------------------------------------------------------------------------
     */

    actionTimelineIdx: index(
      "order_status_history_action_timeline_idx",
    ).on(
      table.action,
      table.changedAt,
    ),

    sourceTimelineIdx: index(
      "order_status_history_source_timeline_idx",
    ).on(
      table.source,
      table.changedAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Audit Lookup
     * ------------------------------------------------------------------------
     */

    auditLookupIdx: index(
      "order_status_history_audit_lookup_idx",
    ).on(
      table.orderId,
      table.action,
      table.changedAt,
    ),

  }),
);
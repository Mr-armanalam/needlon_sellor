// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/relations.ts
// Description: Orders relationships
// Phase: 6.1.5
// ============================================================================

import { relations } from "drizzle-orm";

import { orders } from "./table";

import { seller } from "@/db/schema/seller";
import { sellerStore } from "@/db/schema/seller/seller-store";
import { usersTable } from "@/db/schema/users";
import { sellerAddresses } from "@/db/schema/seller/seller-address";

import { orderItems } from "./order-items/table";
import { orderStatusHistory } from "./order-status-history/table";
import { orderShipments } from "./order-shipments/table";
import { orderPayments } from "./order-payments/table";
import { orderReturns } from "./order-returns/table";
import { orderRefunds } from "./order-refunds/table";

/**
 * ============================================================================
 * Orders Relations
 * ============================================================================
 *
 * Parent Relations
 *
 * sellers
 * stores
 * users (buyer)
 * addresses
 *
 * Child Relations
 *
 * order_items
 * order_status_history
 * order_shipments
 * order_payments
 * order_returns
 * order_refunds
 *
 * ============================================================================
 *
 * Seller
 *      │
 *      ▼
 *   Orders
 *      │
 *      ├────────► Order Items
 *      ├────────► Status History
 *      ├────────► Shipments
 *      ├────────► Payments
 *      ├────────► Returns
 *      └────────► Refunds
 *
 * ============================================================================
 */

export const ordersRelations = relations(
  orders,
  ({ one, many }) => ({
    /**
     * ------------------------------------------------------------------------
     * Seller
     * ------------------------------------------------------------------------
     */

    seller: one(seller, {
      fields: [orders.sellerId],
      references: [seller.id],
    }),

    /**
     * ------------------------------------------------------------------------
     * Buyer
     * ------------------------------------------------------------------------
     */

    buyer: one(usersTable, {
      fields: [orders.buyerId],
      references: [usersTable.id],
    }),

    /**
     * ------------------------------------------------------------------------
     * Store
     * ------------------------------------------------------------------------
     */

    store: one(sellerStore, {
      fields: [orders.storeId],
      references: [sellerStore.id],
    }),

    /**
     * ------------------------------------------------------------------------
     * Shipping Address
     * ------------------------------------------------------------------------
     */

    shippingAddress: one(sellerAddresses, {
      fields: [orders.shippingAddressId],
      references: [sellerAddresses.id],
      relationName: "order_shipping_address",
    }),

    /**
     * ------------------------------------------------------------------------
     * Billing Address
     * ------------------------------------------------------------------------
     */

    billingAddress: one(sellerAddresses, {
      fields: [orders.billingAddressId],
      references: [sellerAddresses.id],
      relationName: "order_billing_address",
    }),

    /**
     * ------------------------------------------------------------------------
     * Order Items
     * ------------------------------------------------------------------------
     */

    items: many(orderItems),

    /**
     * ------------------------------------------------------------------------
     * Order Status History
     * ------------------------------------------------------------------------
     */

    statusHistory: many(
      orderStatusHistory,
    ),

    /**
     * ------------------------------------------------------------------------
     * Shipments
     * ------------------------------------------------------------------------
     */

    shipments: many(
      orderShipments,
    ),

    /**
     * ------------------------------------------------------------------------
     * Payments
     * ------------------------------------------------------------------------
     */

    payments: many(
      orderPayments,
    ),

    /**
     * ------------------------------------------------------------------------
     * Returns
     * ------------------------------------------------------------------------
     */

    returns: many(
      orderReturns,
    ),

    /**
     * ------------------------------------------------------------------------
     * Refunds
     * ------------------------------------------------------------------------
     */

    refunds: many(
      orderRefunds,
    ),
  }),
);
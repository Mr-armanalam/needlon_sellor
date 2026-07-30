// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-shipments/relations.ts
// Description: Order Shipment relations
// Phase: 6.4.5
// ============================================================================

import { relations } from "drizzle-orm";

import { orderShipments } from "./table";

import { orders } from "../table";

import { seller } from "@/db/schema/seller";

/**
 * ============================================================================
 * Order Shipment Relations
 * ============================================================================
 *
 * Parent
 *
 * orders
 *      │
 *      ▼
 * order_shipments
 *
 * Child (Future)
 *
 * order_shipment_items
 *
 * ============================================================================
 *
 * One Order
 *      │
 *      ├────────► Shipment 1
 *      ├────────► Shipment 2
 *      └────────► Shipment 3
 *
 * Supports
 *
 * • Split Shipments
 * • Partial Deliveries
 * • Multiple Couriers
 * • Multiple Packages
 *
 * ============================================================================
 */

export const orderShipmentsRelations = relations(
  orderShipments,
  ({ one, many }) => ({
    /**
     * ------------------------------------------------------------------------
     * Parent Order
     * ------------------------------------------------------------------------
     */

    order: one(orders, {
      fields: [orderShipments.orderId],
      references: [orders.id],
    }),

    /**
     * ------------------------------------------------------------------------
     * Seller
     * ------------------------------------------------------------------------
     */

    seller: one(seller, {
      fields: [orderShipments.sellerId],
      references: [seller.id],
    }),

    /**
     * ------------------------------------------------------------------------
     * Shipment Items
     * ------------------------------------------------------------------------
     *
     * Junction table.
     *
     * Enables:
     *
     * • Split Shipments
     * • Partial Shipments
     * • Item-level Tracking
     * • Warehouse Packing
     */

    shipmentItems: many(
      orderShipments,
    ),
  }),
);
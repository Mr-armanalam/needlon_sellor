// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-shipments/table.ts
// Description: Order Shipments table
// Phase: 6.4.4.1 - Foundation
// ============================================================================

import {
  index,
  integer,
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
  courierPartnerEnum,
  shipmentMethodEnum,
  shipmentStatusEnum,
} from "./constants";

/**
 * ============================================================================
 * Order Shipments
 * ============================================================================
 *
 * Represents a physical shipment created for an order.
 *
 * Supports:
 *
 * • Split Shipments
 * • Multiple Packages
 * • Multiple Couriers
 * • Partial Deliveries
 * • Shipment Tracking
 *
 * One Order
 *      │
 *      ├────────► Shipment #1
 *      │
 *      ├────────► Shipment #2
 *      │
 *      └────────► Shipment #3
 *
 * Shipment history is immutable while the shipment itself
 * progresses through its lifecycle.
 *
 * ============================================================================
 */

export const orderShipments = pgTable(
  "order_shipments",
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
     * Seller responsible for fulfilling this shipment.
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
    // Phase 6.4.4.2
    // Shipment Information
    
        /**
     * ------------------------------------------------------------------------
     * Shipment Information
     * ------------------------------------------------------------------------
     *
     * Business identifiers for this shipment.
     *
     * One order may contain multiple shipments.
     * Each shipment has its own shipment number and
     * tracking information.
     * ------------------------------------------------------------------------
     */

    shipmentNumber: varchar("shipment_number", {
      length: 100,
    }).notNull(),

    shipmentStatus: shipmentStatusEnum(
      "shipment_status",
    )
      .notNull()
      .default("PENDING"),

    /**
     * ------------------------------------------------------------------------
     * Shipping Method
     * ------------------------------------------------------------------------
     */

    shippingMethod: shipmentMethodEnum(
      "shipping_method",
    )
      .notNull()
      .default("STANDARD"),

    /**
     * ------------------------------------------------------------------------
     * Carrier
     * ------------------------------------------------------------------------
     */

    carrier: courierPartnerEnum("carrier")
      .notNull()
      .default("OTHER"),

    /**
     * ------------------------------------------------------------------------
     * Carrier Details
     * ------------------------------------------------------------------------
     *
     * Carrier enum is used internally while
     * carrierName stores the display name.
     * ------------------------------------------------------------------------
     */

    carrierName: varchar("carrier_name", {
      length: 150,
    }),

    /**
     * ------------------------------------------------------------------------
     * Tracking
     * ------------------------------------------------------------------------
     */

    trackingNumber: varchar("tracking_number", {
      length: 255,
    }),

    trackingUrl: text("tracking_url"),

    /**
     * ------------------------------------------------------------------------
     * External Reference
     * ------------------------------------------------------------------------
     *
     * Courier reference,
     * AWB,
     * Manifest ID,
     * Label ID,
     * etc.
     * ------------------------------------------------------------------------
     */

    referenceNumber: varchar("reference_number", {
      length: 255,
    }),

    // Phase 6.4.4.3
    // Logistics
    
        /**
     * ------------------------------------------------------------------------
     * Package Information
     * ------------------------------------------------------------------------
     *
     * One shipment may contain multiple physical packages.
     *
     * Examples
     *
     * • Single Box
     * • Multiple Cartons
     * • Multiple Bags
     * ------------------------------------------------------------------------
     */

    packageCount: integer("package_count")
      .notNull()
      .default(1),

    /**
     * ------------------------------------------------------------------------
     * Physical Dimensions
     * ------------------------------------------------------------------------
     *
     * Values stored at shipment level.
     *
     * Units
     *
     * Weight : Kilograms (kg)
     * Size   : Centimeters (cm)
     * ------------------------------------------------------------------------
     */

    totalWeight: numeric("total_weight", {
      precision: 10,
      scale: 3,
    }),

    length: numeric("length", {
      precision: 10,
      scale: 2,
    }),

    width: numeric("width", {
      precision: 10,
      scale: 2,
    }),

    height: numeric("height", {
      precision: 10,
      scale: 2,
    }),

    // Phase 6.4.4.4
    // Shipment Timeline
    
        /**
     * ------------------------------------------------------------------------
     * Shipment Timeline
     * ------------------------------------------------------------------------
     *
     * Lifecycle timestamps.
     *
     * Every milestone is optional because shipments
     * progress independently.
     * ------------------------------------------------------------------------
     */

    packedAt: timestamp("packed_at", {
      withTimezone: true,
      mode: "date",
    }),

    dispatchedAt: timestamp("dispatched_at", {
      withTimezone: true,
      mode: "date",
    }),

    inTransitAt: timestamp("in_transit_at", {
      withTimezone: true,
      mode: "date",
    }),

    outForDeliveryAt: timestamp(
      "out_for_delivery_at",
      {
        withTimezone: true,
        mode: "date",
      },
    ),

    deliveredAt: timestamp("delivered_at", {
      withTimezone: true,
      mode: "date",
    }),

    failedAt: timestamp("failed_at", {
      withTimezone: true,
      mode: "date",
    }),

    returnedAt: timestamp("returned_at", {
      withTimezone: true,
      mode: "date",
    }),

    cancelledAt: timestamp("cancelled_at", {
      withTimezone: true,
      mode: "date",
    }),

    // Phase 6.4.4.5
    // Metadata
    // Audit
    // Production Indexes
    // ---------------------------------------------------------------------

        /**
     * ------------------------------------------------------------------------
     * Shipment Metadata
     * ------------------------------------------------------------------------
     *
     * Operational information used by sellers,
     * warehouse staff, customer support,
     * and courier integrations.
     * ------------------------------------------------------------------------
     */

    notes: text("notes"),

    internalNotes: text("internal_notes"),

    estimatedDeliveryDate: timestamp(
      "estimated_delivery_date",
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

        /**
     * ------------------------------------------------------------------------
     * Shipment Information
     * ------------------------------------------------------------------------
     */

    shipmentNumberIdx: index(
      "order_shipments_shipment_number_idx",
    ).on(table.shipmentNumber),

    shipmentStatusIdx: index(
      "order_shipments_status_idx",
    ).on(table.shipmentStatus),

    shippingMethodIdx: index(
      "order_shipments_shipping_method_idx",
    ).on(table.shippingMethod),

    carrierIdx: index(
      "order_shipments_carrier_idx",
    ).on(table.carrier),

    carrierNameIdx: index(
      "order_shipments_carrier_name_idx",
    ).on(table.carrierName),

    trackingNumberIdx: index(
      "order_shipments_tracking_number_idx",
    ).on(table.trackingNumber),

    referenceNumberIdx: index(
      "order_shipments_reference_number_idx",
    ).on(table.referenceNumber),

    /**
     * ------------------------------------------------------------------------
     * Dashboard Lookup
     * ------------------------------------------------------------------------
     */

    orderShipmentStatusIdx: index(
      "order_shipments_order_status_idx",
    ).on(
      table.orderId,
      table.shipmentStatus,
    ),

    sellerShipmentStatusIdx: index(
      "order_shipments_seller_status_idx",
    ).on(
      table.sellerId,
      table.shipmentStatus,
    ),

    orderShipmentNumberIdx: index(
      "order_shipments_order_number_idx",
    ).on(
      table.orderId,
      table.shipmentNumber,
    ),

    orderIdx: index(
      "order_shipments_order_idx",
    ).on(table.orderId),

    sellerIdx: index(
      "order_shipments_seller_idx",
    ).on(table.sellerId),

    /**
     * ------------------------------------------------------------------------
     * Dashboard Lookup
     * ------------------------------------------------------------------------
     */

    orderSellerIdx: index(
      "order_shipments_order_seller_idx",
    ).on(
      table.orderId,
      table.sellerId,
    ),

        /**
     * ------------------------------------------------------------------------
     * Delivery Dates
     * ------------------------------------------------------------------------
     */

    estimatedDeliveryIdx: index(
      "order_shipments_estimated_delivery_idx",
    ).on(table.estimatedDeliveryDate),

    actualDeliveryIdx: index(
      "order_shipments_actual_delivery_idx",
    ).on(table.actualDeliveryDate),

    /**
     * ------------------------------------------------------------------------
     * Audit
     * ------------------------------------------------------------------------
     */

    createdAtIdx: index(
      "order_shipments_created_at_idx",
    ).on(table.createdAt),

    updatedAtIdx: index(
      "order_shipments_updated_at_idx",
    ).on(table.updatedAt),

    deletedAtIdx: index(
      "order_shipments_deleted_at_idx",
    ).on(table.deletedAt),

    /**
     * ------------------------------------------------------------------------
     * Seller Dashboard
     * ------------------------------------------------------------------------
     */

    sellerShipmentDashboardIdx: index(
      "order_shipments_seller_dashboard_idx",
    ).on(
      table.sellerId,
      table.shipmentStatus,
      table.createdAt,
    ),

    sellerDeliveryIdx: index(
      "order_shipments_seller_delivery_idx",
    ).on(
      table.sellerId,
      table.actualDeliveryDate,
    ),

    /**
     * ------------------------------------------------------------------------
     * Order Detail Page
     * ------------------------------------------------------------------------
     */

    orderShipmentTimelineIdx: index(
      "order_shipments_order_detail_idx",
    ).on(
      table.orderId,
      table.createdAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Tracking Lookup
     * ------------------------------------------------------------------------
     */

    carrierTrackingIdx: index(
      "order_shipments_carrier_tracking_idx",
    ).on(
      table.carrier,
      table.trackingNumber,
    ),

    /**
     * ------------------------------------------------------------------------
     * Courier Analytics
     * ------------------------------------------------------------------------
     */

    carrierDeliveryIdx: index(
      "order_shipments_carrier_delivery_idx",
    ).on(
      table.carrier,
      table.shipmentStatus,
      table.actualDeliveryDate,
    ),

    /**
     * ------------------------------------------------------------------------
     * Shipment Search
     * ------------------------------------------------------------------------
     */

    shipmentSearchIdx: index(
      "order_shipments_search_idx",
    ).on(
      table.shipmentNumber,
      table.trackingNumber,
    ),

    /**
     * ------------------------------------------------------------------------
     * Soft Delete
     * ------------------------------------------------------------------------
     */

    activeShipmentIdx: index(
      "order_shipments_active_idx",
    ).on(
      table.deletedAt,
      table.shipmentStatus,
    ),
  }),
);
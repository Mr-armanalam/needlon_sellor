// ============================================================================
// Needlon
// Orders Module
// File: modules/orders/order-items/table.ts
// Description: Order Items table
// Phase: 6.2.4.1 - Foundation
// ============================================================================

import {
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { orders } from "../table";

import { seller } from "@/db/schema/seller";
import { productsTable } from "@/db/schema/catalog/products";
import { productVariantsTable } from "@/db/schema/catalog/products/product-variants";

import {
  orderItemDiscountTypeEnum,
  orderItemFulfillmentTypeEnum,
  orderItemSnapshotSourceEnum,
  orderItemStatusEnum,
  orderItemTaxTypeEnum,
} from "./constants";

/**
 * ============================================================================
 * Order Items
 * ============================================================================
 *
 * Immutable snapshot of every purchased item.
 *
 * One Order
 *      ↓
 * Many Order Items
 *
 * Every row represents one purchased SKU.
 *
 * The snapshot NEVER changes after checkout.
 *
 * Child tables
 *
 * • order_returns
 *
 * ============================================================================
 */

export const orderItems = pgTable(
  "order_items",
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
     * Snapshot owner.
     */

    sellerId: uuid("seller_id")
      .notNull()
      .references(() => seller.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),

    /**
     * ------------------------------------------------------------------------
     * Product Reference
     * ------------------------------------------------------------------------
     *
     * Original catalog reference.
     *
     * Snapshot fields preserve historical values.
     */

    productId: uuid("product_id")
      .notNull()
      .references(() => productsTable.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),

    /**
     * ------------------------------------------------------------------------
     * Variant Reference
     * ------------------------------------------------------------------------
     *
     * Nullable because simple products may not
     * have variants.
     */

    variantId: uuid("variant_id").references(
      () => productVariantsTable.id,
      {
        onDelete: "restrict",
        onUpdate: "cascade",
      },
    ),

    // ---------------------------------------------------------------------
    // Remaining columns implemented in:
    //
    // Phase 6.2.4.2
    // Product Snapshot
    

        /**
     * ------------------------------------------------------------------------
     * Product Snapshot
     * ------------------------------------------------------------------------
     *
     * Immutable catalog snapshot captured at checkout.
     *
     * These values MUST NEVER be synchronized with the live product catalog
     * after the order has been placed.
     * ------------------------------------------------------------------------
     */

    sku: varchar("sku", {
      length: 120,
    }).notNull(),

    variantSku: varchar("variant_sku", {
      length: 120,
    }),

    productSlug: varchar("product_slug", {
      length: 255,
    }).notNull(),

    productName: varchar("product_name", {
      length: 255,
    }).notNull(),

    variantName: varchar("variant_name", {
      length: 255,
    }),

    brandName: varchar("brand_name", {
      length: 150,
    }),

    categoryName: varchar("category_name", {
      length: 150,
    }),

    /**
     * ------------------------------------------------------------------------
     * Product Media Snapshot
     * ------------------------------------------------------------------------
     */

    thumbnailUrl: text("thumbnail_url"),

    imageUrl: text("image_url"),

    /**
     * ------------------------------------------------------------------------
     * Snapshot Metadata
     * ------------------------------------------------------------------------
     */

    snapshotSource:
      orderItemSnapshotSourceEnum("snapshot_source")
        .notNull()
        .default("PRODUCT"),


    // Phase 6.2.4.3
    // Pricing
    // Inventory
    // Dimensions
    

        /**
     * ------------------------------------------------------------------------
     * Pricing Snapshot
     * ------------------------------------------------------------------------
     *
     * Immutable financial snapshot captured when the order is placed.
     * Future product price changes MUST NOT affect these values.
     * ------------------------------------------------------------------------
     */

    currency: varchar("currency", {
      length: 3,
    })
      .notNull()
      .default("INR"),

    unitPrice: numeric("unit_price", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0.00"),

    compareAtPrice: numeric("compare_at_price", {
      precision: 12,
      scale: 2,
    }),

    discountType: orderItemDiscountTypeEnum("discount_type")
      .notNull()
      .default("NONE"),

    discountAmount: numeric("discount_amount", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0.00"),

    /**
     * ------------------------------------------------------------------------
     * Tax Snapshot
     * ------------------------------------------------------------------------
     */

    taxType: orderItemTaxTypeEnum("tax_type")
      .notNull()
      .default("NONE"),

    taxRate: numeric("tax_rate", {
      precision: 5,
      scale: 2,
    })
      .notNull()
      .default("0.00"),

    taxAmount: numeric("tax_amount", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0.00"),

    /**
     * ------------------------------------------------------------------------
     * Quantity
     * ------------------------------------------------------------------------
     */

    quantity: integer("quantity")
      .notNull()
      .default(1),

    subtotal: numeric("subtotal", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0.00"),

    total: numeric("total", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0.00"),

    /**
     * ------------------------------------------------------------------------
     * Physical Product Snapshot
     * ------------------------------------------------------------------------
     *
     * Stored for logistics calculations.
     * ------------------------------------------------------------------------
     */

    weight: numeric("weight", {
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

    /**
     * ------------------------------------------------------------------------
     * Inventory Snapshot
     * ------------------------------------------------------------------------
     *
     * Snapshot of fulfillment location.
     * These values are historical and are not synchronized with the inventory
     * module after checkout.
     * ------------------------------------------------------------------------
     */

    inventoryLocation: varchar("inventory_location", {
      length: 255,
    }),

    warehouseName: varchar("warehouse_name", {
      length: 255,
    }),

    // Phase 6.2.4.4
    // Fulfillment
    // Audit
    // Indexes
    // ---------------------------------------------------------------------

        /**
     * ------------------------------------------------------------------------
     * Fulfillment
     * ------------------------------------------------------------------------
     *
     * Current fulfillment state for this individual order item.
     *
     * This is independent from the parent order status.
     * Detailed transitions are stored in shipment/return modules.
     * ------------------------------------------------------------------------
     */

    fulfillmentType: orderItemFulfillmentTypeEnum(
      "fulfillment_type",
    )
      .notNull()
      .default("STANDARD"),

    itemStatus: orderItemStatusEnum("item_status")
      .notNull()
      .default("PENDING"),

    /**
     * ------------------------------------------------------------------------
     * Seller Information
     * ------------------------------------------------------------------------
     *
     * Internal seller reference.
     * Never shown to buyers.
     * ------------------------------------------------------------------------
     */

    sellerSku: varchar("seller_sku", {
      length: 120,
    }),

    notes: text("notes"),

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
     * Fulfillment
     * ------------------------------------------------------------------------
     */

    itemStatusIdx: index(
      "order_items_status_idx",
    ).on(table.itemStatus),

    fulfillmentTypeIdx: index(
      "order_items_fulfillment_type_idx",
    ).on(table.fulfillmentType),

    /**
     * ------------------------------------------------------------------------
     * Audit
     * ------------------------------------------------------------------------
     */

    createdAtIdx: index(
      "order_items_created_at_idx",
    ).on(table.createdAt),

    deletedAtIdx: index(
      "order_items_deleted_at_idx",
    ).on(table.deletedAt),

    /**
     * ------------------------------------------------------------------------
     * Seller Dashboard
     * ------------------------------------------------------------------------
     */

    sellerStatusCreatedIdx: index(
      "order_items_seller_status_created_idx",
    ).on(
      table.sellerId,
      table.itemStatus,
      table.createdAt,
    ),

    sellerFulfillmentIdx: index(
      "order_items_seller_fulfillment_idx",
    ).on(
      table.sellerId,
      table.fulfillmentType,
    ),

    orderStatusIdx: index(
      "order_items_order_status_idx",
    ).on(
      table.orderId,
      table.itemStatus,
    ),

    /**
     * ------------------------------------------------------------------------
     * Product Analytics
     * ------------------------------------------------------------------------
     */

    productStatusIdx: index(
      "order_items_product_status_idx",
    ).on(
      table.productId,
      table.itemStatus,
    ),

    /**
     * ------------------------------------------------------------------------
     * Order Detail Page
     * ------------------------------------------------------------------------
     */

    orderCreatedIdx: index(
      "order_items_order_created_idx",
    ).on(
      table.orderId,
      table.createdAt,
    ),

    /**
     * ------------------------------------------------------------------------
     * Seller SKU
     * ------------------------------------------------------------------------
     */

    sellerSkuIdx: index(
      "order_items_seller_sku_idx",
    ).on(table.sellerSku),

    orderIdx: index(
      "order_items_order_idx",
    ).on(table.orderId),

    sellerIdx: index(
      "order_items_seller_idx",
    ).on(table.sellerId),

    productIdx: index(
      "order_items_product_idx",
    ).on(table.productId),

    variantIdx: index(
      "order_items_variant_idx",
    ).on(table.variantId),

    /**
     * Prevent duplicate product variant rows
     * inside the same order.
     *
     * Quantity should be incremented instead.
     */

    uniqueOrderProductVariantIdx: uniqueIndex(
      "order_items_order_product_variant_unique_idx",
    ).on(
      table.orderId,
      table.productId,
      table.variantId,
    ),
  }),
);
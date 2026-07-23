import { sql } from "drizzle-orm";
import {
    AnyPgColumn,
    boolean,
    check,
    index,
    integer,
    jsonb,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { seller } from "@/db/schema/seller";

import { productVariantsTable } from "@/db/schema/catalog/products/product-variants/table";

import type { InventoryMetadata } from "./metadata";

import {
    INVENTORY_BARCODE_MAX_LENGTH,
    INVENTORY_SKU_MAX_LENGTH,
} from "./constants";

/**
 * ============================================================
 * Inventory
 * ============================================================
 *
 * Stores sellable inventory for a Product Variant.
 *
 * One inventory record exists for each product variant.
 *
 * Example:
 *
 * Product
 * -------
 * Nike Air Max
 *
 * Variant
 * -------
 * Red / XL
 *
 * Inventory
 * ---------
 * Available : 120
 * Reserved  : 8
 * Committed : 5
 *
 * ============================================================
 */

export const inventoryTable = pgTable(
    "inventory",
    {
        /**
         * ----------------------------------------------------------
         * Identity
         * ----------------------------------------------------------
         */

        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        /**
         * ----------------------------------------------------------
         * Product Variant
         * ----------------------------------------------------------
         */

        variantId: uuid("variant_id")
            .notNull()
            .references(
                (): AnyPgColumn =>
                    productVariantsTable.id,
                {
                    onDelete: "cascade",
                },
            ),

        /**
         * ----------------------------------------------------------
         * Stock Identifiers
         * ----------------------------------------------------------
         */

        /**
         * Merchant SKU.
         *
         * Nullable because products may be
         * created before SKU assignment.
         */
        sku: varchar("sku", {
            length: INVENTORY_SKU_MAX_LENGTH,
        }),

        /**
         * Barcode / UPC / EAN / ISBN.
         */
        barcode: varchar("barcode", {
            length:
            INVENTORY_BARCODE_MAX_LENGTH,
        }),

        /**
         * ----------------------------------------------------------
         * Continue in Part 2...
         * ----------------------------------------------------------
         */

        /**
         * ----------------------------------------------------------
         * Inventory Quantities
         * ----------------------------------------------------------
         *
         * All quantities represent physical units.
         *
         * Sellable Quantity =
         *
         * Available
         * - Reserved
         * - Committed
         */

        /**
         * Current physical stock.
         */
        availableQuantity: integer(
            "available_quantity",
        )
            .default(0)
            .notNull(),

        /**
         * Reserved during checkout.
         */
        reservedQuantity: integer(
            "reserved_quantity",
        )
            .default(0)
            .notNull(),

        /**
         * Allocated to confirmed orders
         * awaiting fulfillment.
         */
        committedQuantity: integer(
            "committed_quantity",
        )
            .default(0)
            .notNull(),

        /**
         * Unsellable damaged stock.
         */
        damagedQuantity: integer(
            "damaged_quantity",
        )
            .default(0)
            .notNull(),

        /**
         * Returned stock awaiting inspection.
         */
        returnedQuantity: integer(
            "returned_quantity",
        )
            .default(0)
            .notNull(),

        /**
         * ----------------------------------------------------------
         * Inventory Thresholds
         * ----------------------------------------------------------
         */

        /**
         * Low stock alert threshold.
         */
        minimumStock: integer(
            "minimum_stock",
        )
            .default(0)
            .notNull(),

        /**
         * Optional warehouse/storage capacity.
         *
         * NULL = Unlimited / Not tracked
         */
        maximumStock: integer(
            "maximum_stock",
        ),

        /**
         * ----------------------------------------------------------
         * Inventory Controls
         * ----------------------------------------------------------
         */

        /**
         * Whether inventory is tracked for this variant.
         *
         * Examples:
         *
         * Physical Product → true
         * Digital Product  → false
         */
        trackInventory: boolean(
            "track_inventory",
        )
            .default(true)
            .notNull(),

        /**
         * Whether purchases are allowed after
         * sellable inventory reaches zero.
         */
        allowBackorders: boolean(
            "allow_backorders",
        )
            .default(false)
            .notNull(),

        /**
         * ----------------------------------------------------------
         * Metadata
         * ----------------------------------------------------------
         *
         * Reserved for:
         *
         * • ERP/WMS synchronization
         * • Import information
         * • AI enrichment
         * • Future platform extensions
         */

        metadata: jsonb("metadata")
            .$type<InventoryMetadata>()
            .default(sql`'{}'::jsonb`)
            .notNull(),

        /**
         * ----------------------------------------------------------
         * Audit
         * ----------------------------------------------------------
         */

        createdBy: uuid("created_by").references(
            (): AnyPgColumn => seller.id,
            {
                onDelete: "set null",
            },
        ),

        updatedBy: uuid("updated_by").references(
            (): AnyPgColumn => seller.id,
            {
                onDelete: "set null",
            },
        ),

        /**
         * ----------------------------------------------------------
         * Timestamps
         * ----------------------------------------------------------
         */

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

        /**
         * ----------------------------------------------------------
         * Soft Delete
         * ----------------------------------------------------------
         *
         * NULL     = Active
         * NOT NULL = Soft Deleted
         */

        deletedAt: timestamp("deleted_at", {
            withTimezone: true,
        }),

        /**
         * ----------------------------------------------------------
         * Continue in Part 4...
         * ----------------------------------------------------------
         */

    },

    (table) => ({
        /**
         * ==========================================================
         * Uniqueness
         * ==========================================================
         */

        /**
         * One inventory record per product variant.
         */
        variantUniqueIdx: uniqueIndex(
            "inventory_variant_uidx",
        ).on(table.variantId),

        /**
         * Merchant SKU.
         *
         * Nullable until assigned.
         */
        skuUniqueIdx: uniqueIndex(
            "inventory_sku_uidx",
        ).on(table.sku),

        /**
         * ==========================================================
         * Foreign Key Lookup Indexes
         * ==========================================================
         */

        variantIdx: index(
            "inventory_variant_idx",
        ).on(table.variantId),

        skuIdx: index(
            "inventory_sku_idx",
        ).on(table.sku),

        barcodeIdx: index(
            "inventory_barcode_idx",
        ).on(table.barcode),

        /**
         * ==========================================================
         * Inventory Query Indexes
         * ==========================================================
         */

        availableQuantityIdx: index(
            "inventory_available_quantity_idx",
        ).on(table.availableQuantity),

        reservedQuantityIdx: index(
            "inventory_reserved_quantity_idx",
        ).on(table.reservedQuantity),

        committedQuantityIdx: index(
            "inventory_committed_quantity_idx",
        ).on(table.committedQuantity),

        trackInventoryIdx: index(
            "inventory_track_inventory_idx",
        ).on(table.trackInventory),

        allowBackordersIdx: index(
            "inventory_allow_backorders_idx",
        ).on(table.allowBackorders),

        /**
         * ==========================================================
         * Audit
         * ==========================================================
         */

        createdByIdx: index(
            "inventory_created_by_idx",
        ).on(table.createdBy),

        updatedByIdx: index(
            "inventory_updated_by_idx",
        ).on(table.updatedBy),

        /**
         * ==========================================================
         * Lifecycle
         * ==========================================================
         */

        createdAtIdx: index(
            "inventory_created_at_idx",
        ).on(table.createdAt),

        deletedAtIdx: index(
            "inventory_deleted_at_idx",
        ).on(table.deletedAt),

        /**
         * ==========================================================
         * Database Constraints
         * ==========================================================
         */

        availableQuantityCheck: check(
            "inventory_available_quantity_check",
            sql`${table.availableQuantity} >= 0`,
        ),

        reservedQuantityCheck: check(
            "inventory_reserved_quantity_check",
            sql`${table.reservedQuantity} >= 0`,
        ),

        committedQuantityCheck: check(
            "inventory_committed_quantity_check",
            sql`${table.committedQuantity} >= 0`,
        ),

        damagedQuantityCheck: check(
            "inventory_damaged_quantity_check",
            sql`${table.damagedQuantity} >= 0`,
        ),

        returnedQuantityCheck: check(
            "inventory_returned_quantity_check",
            sql`${table.returnedQuantity} >= 0`,
        ),

        minimumStockCheck: check(
            "inventory_minimum_stock_check",
            sql`${table.minimumStock} >= 0`,
        ),

        maximumStockCheck: check(
            "inventory_maximum_stock_check",
            sql`${table.maximumStock} IS NULL
        OR ${table.maximumStock} >= 0`,
        ),
    }),
);
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

        id: uuid("id").defaultRandom().primaryKey(),
        
        /**
         * ----------------------------------------------------------
         * Product Variant
         * ----------------------------------------------------------
         */

        variantId: uuid("variant_id").notNull().references(() => productVariantsTable.id, { onDelete: "cascade" }),
    
        quantity: integer("quantity").default(0).notNull(),
        reservedQuantity: integer("reserved_quantity").default(0),
        lowStockThreshold: integer("low_stock_threshold").default(0),
        allowBackorder: boolean("allow_backorder").default(false),
        lastAdjustedAt: timestamp("last_adjusted_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),

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
        // skuUniqueIdx: uniqueIndex("inventory_sku_uidx").on(table.variantId),

        /**
         * ==========================================================
         * Foreign Key Lookup Indexes
         * ==========================================================
         */

        variantIdx: index(
            "inventory_variant_idx",
        ).on(table.variantId),

        /**
         * ==========================================================
         * Lifecycle
         * ==========================================================
         */

        createdAtIdx: index(
            "inventory_created_at_idx",
        ).on(table.createdAt),
    }),
);
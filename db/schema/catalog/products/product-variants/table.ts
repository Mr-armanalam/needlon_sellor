import { sql } from "drizzle-orm";
import {
    AnyPgColumn, boolean,
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

import { productsTable } from "@/db/schema/catalog/products/table";

import { productVariantStatusEnum } from "../../enums";

import type { ProductVariantMetadata } from "./metadata";

import {
    PRODUCT_VARIANT_BARCODE_MAX_LENGTH,
    PRODUCT_VARIANT_SKU_MAX_LENGTH,
    PRODUCT_VARIANT_TITLE_MAX_LENGTH,
} from "./constants";

/**
 * ============================================================
 * Product Variants
 * ============================================================
 *
 * Represents a purchasable variation of a product.
 *
 * Examples:
 *
 * Product:
 * Nike Air Max
 *
 * Variants:
 * - Red / XL
 * - Red / L
 * - Blue / XL
 *
 * Pricing, inventory, shipping and images are intentionally
 * stored in dedicated modules.
 *
 * ============================================================
 */

export const productVariantsTable = pgTable(
    "product_variants",
    {
        /**
         * ----------------------------------------------------------
         * Identity
         * ----------------------------------------------------------
         */

        id: uuid("id").defaultRandom().primaryKey(),
        productId: uuid("product_id").notNull().references(() => productsTable.id, { onDelete: "cascade" }),
        sku: varchar("sku", { length: PRODUCT_VARIANT_SKU_MAX_LENGTH }).notNull(),
        barcode: varchar("barcode", { length: PRODUCT_VARIANT_BARCODE_MAX_LENGTH }),
        price: varchar("price"),
        compareAtPrice: varchar("compare_at_price"),
        costPrice: varchar("cost_price"),
        weightGrams: integer("weight_grams"),
        status: productVariantStatusEnum("status").notNull().default("ACTIVE"),
        position: integer("position").notNull().default(0),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
        deletedAt: timestamp("deleted_at", { withTimezone: true }),

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
         * SKU must be unique within a product.
         *
         * Allows different products to reuse
         * merchant SKU patterns if desired.
         */
        productSkuUniqueIdx: uniqueIndex(
            "product_variants_product_sku_uidx",
        ).on(
            table.productId,
            table.sku,
        ),

        /**
         * Optional barcode.
         *
         * Multiple NULL values are allowed.
         */
        barcodeUniqueIdx: uniqueIndex(
            "product_variants_barcode_uidx",
        ).on(table.barcode),

        /**
         * ==========================================================
         * Product
         * ==========================================================
         */

        productIdx: index(
            "product_variants_product_idx",
        ).on(table.productId),

        productStatusIdx: index(
            "product_variants_product_status_idx",
        ).on(
            table.productId,
            table.status,
        ),

        // productDisplayOrderIdx: index("product_variants_product_display_order_idx").on(table.productId),
        // defaultVariantIdx: index("product_variants_default_idx").on(table.productId),
        // visibleVariantIdx: index("product_variants_visible_idx").on(table.productId),
        // purchasableVariantIdx: index("product_variants_purchasable_idx").on(table.productId),

        /**
         * ==========================================================
         * Business Identity
         * ==========================================================
         */

        skuIdx: index(
            "product_variants_sku_idx",
        ).on(table.sku),

        /**
         * ==========================================================
         * Audit
         * ==========================================================
         */

        // createdByIdx: index("product_variants_created_by_idx").on(table.createdBy),
        // updatedByIdx: index("product_variants_updated_by_idx").on(table.updatedBy),

        /**
         * ==========================================================
         * Lifecycle
         * ==========================================================
         */

        createdAtIdx: index(
            "product_variants_created_at_idx",
        ).on(table.createdAt),

        deletedAtIdx: index(
            "product_variants_deleted_at_idx",
        ).on(table.deletedAt),

        /**
         * ==========================================================
         * Database Constraints
         * ==========================================================
         */

        // titleNotEmptyCheck: check("product_variants_title_not_empty_check", sql`length(trim(${table.sku})) > 0`),

        skuNotEmptyCheck: check(
            "product_variants_sku_not_empty_check",
            sql`length(trim(${table.sku})) > 0`,
        ),

        // displayOrderCheck: check("product_variants_display_order_check", sql`${table.position} >= 0`),
    }),
);
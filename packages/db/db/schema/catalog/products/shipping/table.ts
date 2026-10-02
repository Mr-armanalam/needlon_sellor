import { sql } from "drizzle-orm";
import {
    AnyPgColumn,
    boolean,
    check,
    index,
    jsonb,
    numeric,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";

import { seller } from "@/db/schema/seller";

import { productVariantsTable } from "@/db/schema/catalog/products/product-variants/table";

import {
    dimensionUnitEnum,
    shippingClassEnum,
    weightUnitEnum,
} from "@/db/schema/catalog/enums";

import type { ShippingMetadata } from "./metadata";

import {
    SHIPPING_DIMENSION_PRECISION,
    SHIPPING_DIMENSION_SCALE,
    SHIPPING_WEIGHT_PRECISION,
    SHIPPING_WEIGHT_SCALE,
} from "./constants";

/**
 * ============================================================
 * Shipping
 * ============================================================
 *
 * Stores shipping configuration for a Product Variant.
 *
 * One shipping record exists for each product variant.
 *
 * Example
 *
 * Product
 * -------
 * Nike Air Max
 *
 * Variant
 * -------
 * Red / XL
 *
 * Shipping
 * --------
 * Weight  : 0.850 kg
 * Length  : 35.00 cm
 * Width   : 22.00 cm
 * Height  : 12.00 cm
 *
 * ============================================================
 */

export const shippingTable = pgTable(
    "shipping",
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
         * Weight
         * ----------------------------------------------------------
         */

        /**
         * Physical package weight.
         *
         * Required for physical products.
         *
         * NULL = Not applicable
         * (Digital products)
         */
        weight: numeric("weight", {
            precision: SHIPPING_WEIGHT_PRECISION,
            scale: SHIPPING_WEIGHT_SCALE,
        }),

        /**
         * Unit of weight.
         *
         * Examples:
         * KG
         * G
         * LB
         * OZ
         */
        weightUnit: weightUnitEnum(
            "weight_unit",
        )
            .default("KG")
            .notNull(),

/**
 * ----------------------------------------------------------
 * Continue in Part 2...
 * ----------------------------------------------------------
 */

        /**
         * ----------------------------------------------------------
         * Package Dimensions
         * ----------------------------------------------------------
         */

        /**
         * Package length.
         *
         * NULL = Not applicable
         */
        length: numeric("length", {
            precision: SHIPPING_DIMENSION_PRECISION,
            scale: SHIPPING_DIMENSION_SCALE,
        }),

        /**
         * Package width.
         *
         * NULL = Not applicable
         */
        width: numeric("width", {
            precision: SHIPPING_DIMENSION_PRECISION,
            scale: SHIPPING_DIMENSION_SCALE,
        }),

        /**
         * Package height.
         *
         * NULL = Not applicable
         */
        height: numeric("height", {
            precision: SHIPPING_DIMENSION_PRECISION,
            scale: SHIPPING_DIMENSION_SCALE,
        }),

        /**
         * Dimension measurement unit.
         *
         * Examples:
         * CM
         * MM
         * IN
         */
        dimensionUnit: dimensionUnitEnum(
            "dimension_unit",
        )
            .default("CM")
            .notNull(),

        /**
         * ----------------------------------------------------------
         * Shipping Configuration
         * ----------------------------------------------------------
         */

        /**
         * Whether this variant requires
         * physical shipping.
         *
         * Digital products should set
         * this to false.
         */
        requiresShipping: boolean(
            "requires_shipping",
        )
            .default(true)
            .notNull(),

        /**
         * Whether this variant qualifies
         * for free shipping.
         */
        isFreeShipping: boolean(
            "is_free_shipping",
        )
            .default(false)
            .notNull(),

        /**
         * Shipping classification.
         *
         * Used by:
         * • Shipping rules
         * • Courier integrations
         * • Rate calculation
         */
        shippingClass: shippingClassEnum(
            "shipping_class",
        )
            .default("STANDARD")
            .notNull(),

        /**
         * Indicates fragile handling
         * requirements.
         */
        isFragile: boolean(
            "is_fragile",
        )
            .default(false)
            .notNull(),

        /**
         * Indicates hazardous material.
         *
         * Used for carrier compliance.
         */
        isHazardous: boolean(
            "is_hazardous",
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
         * • Packaging information
         * • Carrier preferences
         * • AI shipping recommendations
         * • Future platform extensions
         */

        metadata: jsonb("metadata")
            .$type<ShippingMetadata>()
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
         * One shipping record per product variant.
         */
        variantUniqueIdx: uniqueIndex(
            "shipping_variant_uidx",
        ).on(table.variantId),

        /**
         * ==========================================================
         * Foreign Key Lookup Indexes
         * ==========================================================
         */

        variantIdx: index(
            "shipping_variant_idx",
        ).on(table.variantId),

        /**
         * ==========================================================
         * Shipping Query Indexes
         * ==========================================================
         */

        requiresShippingIdx: index(
            "shipping_requires_shipping_idx",
        ).on(table.requiresShipping),

        isFreeShippingIdx: index(
            "shipping_is_free_shipping_idx",
        ).on(table.isFreeShipping),

        shippingClassIdx: index(
            "shipping_shipping_class_idx",
        ).on(table.shippingClass),

        isFragileIdx: index(
            "shipping_is_fragile_idx",
        ).on(table.isFragile),

        isHazardousIdx: index(
            "shipping_is_hazardous_idx",
        ).on(table.isHazardous),

        /**
         * ==========================================================
         * Audit
         * ==========================================================
         */

        createdByIdx: index(
            "shipping_created_by_idx",
        ).on(table.createdBy),

        updatedByIdx: index(
            "shipping_updated_by_idx",
        ).on(table.updatedBy),

        /**
         * ==========================================================
         * Lifecycle
         * ==========================================================
         */

        createdAtIdx: index(
            "shipping_created_at_idx",
        ).on(table.createdAt),

        deletedAtIdx: index(
            "shipping_deleted_at_idx",
        ).on(table.deletedAt),

        /**
         * ==========================================================
         * Database Constraints
         * ==========================================================
         */

        weightCheck: check(
            "shipping_weight_check",
            sql`${table.weight} IS NULL
        OR ${table.weight} >= 0`,
        ),

        lengthCheck: check(
            "shipping_length_check",
            sql`${table.length} IS NULL
        OR ${table.length} >= 0`,
        ),

        widthCheck: check(
            "shipping_width_check",
            sql`${table.width} IS NULL
        OR ${table.width} >= 0`,
        ),

        heightCheck: check(
            "shipping_height_check",
            sql`${table.height} IS NULL
        OR ${table.height} >= 0`,
        ),
    }),
);
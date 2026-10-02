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
    varchar,
} from "drizzle-orm/pg-core";

import { seller } from "@/db/schema/seller";

import { productVariantsTable } from "@/db/schema/catalog/products/product-variants/table";

import type { PricingMetadata } from "./metadata";

import {
    PRICING_AMOUNT_PRECISION,
    PRICING_AMOUNT_SCALE,
    PRICING_CURRENCY_CODE_LENGTH,
} from "./constants";

/**
 * ============================================================
 * Pricing
 * ============================================================
 *
 * Stores pricing information for a Product Variant.
 *
 * One pricing record exists for each product variant.
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
 * Pricing
 * -------
 * Price           : ₹2,499
 * Compare At      : ₹2,999
 * Cost            : ₹1,750
 *
 * ============================================================
 */

export const pricingTable = pgTable(
    "pricing",
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
         * Currency
         * ----------------------------------------------------------
         *
         * ISO-4217 currency code.
         *
         * Examples:
         *
         * INR
         * USD
         * EUR
         */

        currencyCode: varchar(
            "currency_code",
            {
                length:
                PRICING_CURRENCY_CODE_LENGTH,
            },
        )
            .default("INR")
            .notNull(),


        /**
         * ----------------------------------------------------------
         * Monetary Values
         * ----------------------------------------------------------
         */

        /**
         * Current selling price.
         *
         * Customer pays this amount.
         */
        price: numeric("price", {
            precision: PRICING_AMOUNT_PRECISION,
            scale: PRICING_AMOUNT_SCALE,
        })
            .notNull(),

        /**
         * Original / MRP price.
         *
         * Used for:
         * • Strike-through pricing
         * • Discount calculations
         *
         * NULL = No compare price
         */
        compareAtPrice: numeric(
            "compare_at_price",
            {
                precision: PRICING_AMOUNT_PRECISION,
                scale: PRICING_AMOUNT_SCALE,
            },
        ),

        /**
         * Internal procurement /
         * manufacturing cost.
         *
         * Never exposed to customers.
         */
        costPrice: numeric(
            "cost_price",
            {
                precision: PRICING_AMOUNT_PRECISION,
                scale: PRICING_AMOUNT_SCALE,
            },
        ),

        /**
         * Minimum Advertised Price (MAP).
         *
         * Optional.
         *
         * Used by brands that prohibit
         * advertising below a specific price.
         */
        minimumAdvertisedPrice: numeric(
            "minimum_advertised_price",
            {
                precision: PRICING_AMOUNT_PRECISION,
                scale: PRICING_AMOUNT_SCALE,
            },
        ),

        /**
         * ----------------------------------------------------------
         * Scheduled Pricing
         * ----------------------------------------------------------
         */

        /**
         * Price becomes active at.
         *
         * NULL = Active immediately.
         */
        effectiveFrom: timestamp(
            "effective_from",
            {
                withTimezone: true,
            },
        ),

        /**
         * Price expires at.
         *
         * NULL = Never expires.
         */
        effectiveUntil: timestamp(
            "effective_until",
            {
                withTimezone: true,
            },
        ),

        /**
         * ----------------------------------------------------------
         * Tax
         * ----------------------------------------------------------
         */

        /**
         * Whether the selling price
         * already includes applicable tax.
         */
        isTaxInclusive: boolean(
            "is_tax_inclusive",
        )
            .default(true)
            .notNull(),

        /**
         * ----------------------------------------------------------
         * Metadata
         * ----------------------------------------------------------
         *
         * Reserved for:
         *
         * • Pricing campaigns
         * • AI pricing insights
         * • Import information
         * • Future platform extensions
         */

        metadata: jsonb("metadata")
            .$type<PricingMetadata>()
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


    },

    (table) => ({
        /**
         * ==========================================================
         * Uniqueness
         * ==========================================================
         */

        /**
         * One pricing record per product variant.
         */
        variantUniqueIdx: uniqueIndex(
            "pricing_variant_uidx",
        ).on(table.variantId),

        /**
         * ==========================================================
         * Foreign Key Lookup Indexes
         * ==========================================================
         */

        variantIdx: index(
            "pricing_variant_idx",
        ).on(table.variantId),

        /**
         * ==========================================================
         * Pricing Query Indexes
         * ==========================================================
         */

        currencyCodeIdx: index(
            "pricing_currency_code_idx",
        ).on(table.currencyCode),

        priceIdx: index(
            "pricing_price_idx",
        ).on(table.price),

        effectiveFromIdx: index(
            "pricing_effective_from_idx",
        ).on(table.effectiveFrom),

        effectiveUntilIdx: index(
            "pricing_effective_until_idx",
        ).on(table.effectiveUntil),

        /**
         * ==========================================================
         * Audit
         * ==========================================================
         */

        createdByIdx: index(
            "pricing_created_by_idx",
        ).on(table.createdBy),

        updatedByIdx: index(
            "pricing_updated_by_idx",
        ).on(table.updatedBy),

        /**
         * ==========================================================
         * Lifecycle
         * ==========================================================
         */

        createdAtIdx: index(
            "pricing_created_at_idx",
        ).on(table.createdAt),

        deletedAtIdx: index(
            "pricing_deleted_at_idx",
        ).on(table.deletedAt),

        /**
         * ==========================================================
         * Database Constraints
         * ==========================================================
         */

        priceCheck: check(
            "pricing_price_check",
            sql`${table.price} >= 0`,
        ),

        compareAtPriceCheck: check(
            "pricing_compare_at_price_check",
            sql`${table.compareAtPrice} IS NULL
        OR ${table.compareAtPrice} >= 0`,
        ),

        costPriceCheck: check(
            "pricing_cost_price_check",
            sql`${table.costPrice} IS NULL
        OR ${table.costPrice} >= 0`,
        ),

        minimumAdvertisedPriceCheck: check(
            "pricing_minimum_advertised_price_check",
            sql`${table.minimumAdvertisedPrice} IS NULL
        OR ${table.minimumAdvertisedPrice} >= 0`,
        ),

        effectivePeriodCheck: check(
            "pricing_effective_period_check",
            sql`${table.effectiveUntil} IS NULL
        OR ${table.effectiveFrom} IS NULL
        OR ${table.effectiveUntil} >= ${table.effectiveFrom}`,
        ),
    }),
);
import { sql } from "drizzle-orm";
import {
    AnyPgColumn, boolean,
    check, date,
    index,
    jsonb, numeric,
    pgTable, text,
    timestamp,
    uniqueIndex,
    uuid, varchar,
} from "drizzle-orm/pg-core";

import { seller } from "@/db/schema/seller";

import { categoryAttributesTable } from "@/db/schema/catalog/category-attributes";
import { categoryAttributeOptionsTable } from "@/db/schema/catalog/category-attribute-options";

import { productsTable } from "@/db/schema/catalog/products/table";

import type { ProductAttributeValueMetadata } from "./metadata";

import {
    PRODUCT_ATTRIBUTE_DISPLAY_VALUE_MAX_LENGTH,
} from "./constants";

/**
 * ============================================================
 * Product Attribute Values
 * ============================================================
 *
 * Stores product-level values for category attributes.
 *
 * Examples:
 *
 * Brand              → Nike
 * Country            → India
 * Fabric GSM         → 220
 * Wash Care          → Machine Wash
 *
 * Unlike Variant Options, these values are shared
 * across every variant of the product.
 *
 * ============================================================
 */

export const productAttributeValuesTable =
    pgTable(
        "product_attribute_values",
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
             * Product
             * ----------------------------------------------------------
             */

            productId: uuid("product_id")
                .notNull()
                .references(
                    (): AnyPgColumn => productsTable.id,
                    {
                        onDelete: "cascade",
                    },
                ),

            /**
             * ----------------------------------------------------------
             * Category Attribute
             * ----------------------------------------------------------
             */

            attributeId: uuid("attribute_id")
                .notNull()
                .references(
                    (): AnyPgColumn =>
                        categoryAttributesTable.id,
                    {
                        onDelete: "restrict",
                    },
                ),

            /**
             * ----------------------------------------------------------
             * Category Attribute Option
             * ----------------------------------------------------------
             *
             * Nullable because many attributes store
             * free-form values instead of predefined
             * options.
             */

            attributeOptionId: uuid(
                "attribute_option_id",
            ).references(
                (): AnyPgColumn =>
                    categoryAttributeOptionsTable.id,
                {
                    onDelete: "restrict",
                },
            ),

/**
 * ----------------------------------------------------------
 * Continue in Part 2...
 * ----------------------------------------------------------
 */

            /**
             * ----------------------------------------------------------
             * Dynamic Value Columns
             * ----------------------------------------------------------
             *
             * Exactly ONE of these should be populated,
             * depending on the attribute's configured
             * data type.
             */

            /**
             * Text value.
             *
             * Example:
             * Wash Care → Machine Wash
             */
            valueText: text("value_text"),

            /**
             * Numeric value.
             *
             * Example:
             * GSM → 220
             */
            valueNumber: numeric("value_number", {
                precision: 18,
                scale: 4,
            }),

            /**
             * Boolean value.
             *
             * Example:
             * Stretchable → true
             */
            valueBoolean: boolean("value_boolean"),

            /**
             * Date value.
             *
             * Example:
             * Manufactured On
             */
            valueDate: date("value_date"),

            /**
             * Complex structured value.
             *
             * Example:
             * Care Instructions
             * Specification JSON
             */
            valueJson: jsonb("value_json"),

            /**
             * ----------------------------------------------------------
             * Display Value
             * ----------------------------------------------------------
             *
             * Human-readable formatted value.
             *
             * Examples:
             *
             * 220
             * ↓
             * 220 GSM
             *
             * true
             * ↓
             * Yes
             */
            displayValue: varchar(
                "display_value",
                {
                    length:
                    PRODUCT_ATTRIBUTE_DISPLAY_VALUE_MAX_LENGTH,
                },
            ),

            /**
             * ----------------------------------------------------------
             * Metadata
             * ----------------------------------------------------------
             *
             * Reserved for:
             *
             * • Import information
             * • AI enrichment
             * • Future platform extensions
             */

            metadata: jsonb("metadata")
                .$type<ProductAttributeValueMetadata>()
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
             * A product can have only one value
             * for the same attribute.
             */
            productAttributeUniqueIdx: uniqueIndex(
                "product_attribute_values_product_attribute_uidx",
            ).on(
                table.productId,
                table.attributeId,
            ),

            /**
             * ==========================================================
             * Foreign Key Lookup Indexes
             * ==========================================================
             */

            productIdx: index(
                "product_attribute_values_product_idx",
            ).on(table.productId),

            attributeIdx: index(
                "product_attribute_values_attribute_idx",
            ).on(table.attributeId),

            attributeOptionIdx: index(
                "product_attribute_values_attribute_option_idx",
            ).on(table.attributeOptionId),

            /**
             * Frequently used when loading all
             * attributes for a product.
             */
            productAttributeIdx: index(
                "product_attribute_values_product_attribute_idx",
            ).on(
                table.productId,
                table.attributeId,
            ),

            /**
             * Used by faceted search and analytics.
             */
            optionLookupIdx: index(
                "product_attribute_values_option_lookup_idx",
            ).on(
                table.attributeOptionId,
                table.productId,
            ),

            /**
             * ==========================================================
             * Dynamic Value Indexes
             * ==========================================================
             */

            valueTextIdx: index(
                "product_attribute_values_value_text_idx",
            ).on(table.valueText),

            valueNumberIdx: index(
                "product_attribute_values_value_number_idx",
            ).on(table.valueNumber),

            valueBooleanIdx: index(
                "product_attribute_values_value_boolean_idx",
            ).on(table.valueBoolean),

            valueDateIdx: index(
                "product_attribute_values_value_date_idx",
            ).on(table.valueDate),

            /**
             * ==========================================================
             * Audit
             * ==========================================================
             */

            createdByIdx: index(
                "product_attribute_values_created_by_idx",
            ).on(table.createdBy),

            updatedByIdx: index(
                "product_attribute_values_updated_by_idx",
            ).on(table.updatedBy),

            /**
             * ==========================================================
             * Lifecycle
             * ==========================================================
             */

            createdAtIdx: index(
                "product_attribute_values_created_at_idx",
            ).on(table.createdAt),

            deletedAtIdx: index(
                "product_attribute_values_deleted_at_idx",
            ).on(table.deletedAt),

            /**
             * ==========================================================
             * Database Constraints
             * ==========================================================
             *
             * Cross-table validations are intentionally
             * handled in the service layer:
             *
             * • attributeOption.attributeId === attributeId
             * • Attribute belongs to Product Category
             * • Exactly one value source is populated
             * • Value matches attribute data type
             */

            productIdNotNullCheck: check(
                "product_attribute_values_product_id_check",
                sql`${table.productId} IS NOT NULL`,
            ),

            attributeIdNotNullCheck: check(
                "product_attribute_values_attribute_id_check",
                sql`${table.attributeId} IS NOT NULL`,
            ),
        }),
    );
import { sql } from "drizzle-orm";
import {
    AnyPgColumn,
    check,
    index,
    jsonb,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";

import { seller } from "@/db/schema/seller";

import { categoryAttributesTable } from "@/db/schema/catalog/category-attributes";

import { categoryAttributeOptionsTable } from "@/db/schema/catalog/category-attribute-options";

import { productVariantsTable } from "@/db/schema/catalog/products/product-variants/table";

import type { ProductVariantOptionMetadata } from "./metadata";

/**
 * ============================================================
 * Product Variant Options
 * ============================================================
 *
 * Junction table connecting a Product Variant
 * with the selected Category Attribute Options.
 *
 * Example:
 *
 * Variant
 * -------
 * Red / XL
 *
 * Rows
 * ----
 * Color -> Red
 * Size  -> XL
 *
 * ============================================================
 */

export const productVariantOptionsTable =
    pgTable(
        "product_variant_options",
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
             */

            attributeOptionId: uuid(
                "attribute_option_id",
            )
                .notNull()
                .references(
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
                .$type<ProductVariantOptionMetadata>()
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
             * Continue in Part 3...
             * ----------------------------------------------------------
             */

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
             * A variant can only have one selected option
             * for a given attribute.
             *
             * Example:
             *
             * ✔ Color → Red
             * ✔ Size  → XL
             *
             * ✘ Color → Red
             * ✘ Color → Blue
             */
            variantAttributeUniqueIdx: uniqueIndex(
                "product_variant_options_variant_attribute_uidx",
            ).on(
                table.variantId,
                table.attributeId,
            ),

            /**
             * ==========================================================
             * Foreign Key Lookup Indexes
             * ==========================================================
             */

            variantIdx: index(
                "product_variant_options_variant_idx",
            ).on(table.variantId),

            attributeIdx: index(
                "product_variant_options_attribute_idx",
            ).on(table.attributeId),

            attributeOptionIdx: index(
                "product_variant_options_attribute_option_idx",
            ).on(table.attributeOptionId),

            /**
             * Used heavily by storefront filters.
             */
            variantAttributeIdx: index(
                "product_variant_options_variant_attribute_idx",
            ).on(
                table.variantId,
                table.attributeId,
            ),

            /**
             * Used when searching all variants
             * that selected a particular option.
             */
            optionLookupIdx: index(
                "product_variant_options_option_lookup_idx",
            ).on(
                table.attributeOptionId,
                table.variantId,
            ),

            /**
             * ==========================================================
             * Audit
             * ==========================================================
             */

            createdByIdx: index(
                "product_variant_options_created_by_idx",
            ).on(table.createdBy),

            updatedByIdx: index(
                "product_variant_options_updated_by_idx",
            ).on(table.updatedBy),

            /**
             * ==========================================================
             * Lifecycle
             * ==========================================================
             */

            createdAtIdx: index(
                "product_variant_options_created_at_idx",
            ).on(table.createdAt),

            deletedAtIdx: index(
                "product_variant_options_deleted_at_idx",
            ).on(table.deletedAt),

            /**
             * ==========================================================
             * Database Constraints
             * ==========================================================
             *
             * Cross-table validation such as:
             *
             * attribute_option.attribute_id
             * ==
             * attribute_id
             *
             * is intentionally enforced in the
             * service layer rather than with
             * database triggers.
             */

            variantIdNotNullCheck: check(
                "product_variant_options_variant_id_check",
                sql`${table.variantId} IS NOT NULL`,
            ),

            attributeIdNotNullCheck: check(
                "product_variant_options_attribute_id_check",
                sql`${table.attributeId} IS NOT NULL`,
            ),

            attributeOptionIdNotNullCheck: check(
                "product_variant_options_attribute_option_id_check",
                sql`${table.attributeOptionId} IS NOT NULL`,
            ),
        }),
    );
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

import { productsTable } from "@/db/schema/catalog/products/table";
import { productTagsTable } from "@/db/schema/catalog/products/product-tags/table";

import type { ProductTagMappingMetadata } from "./metadata";

/**
 * ============================================================
 * Product Tag Mappings
 * ============================================================
 *
 * Join table connecting Products and Tags.
 *
 * This implements the normalized many-to-many
 * relationship.
 *
 * Product
 *    ▲
 *    │
 * ProductTagMapping
 *    │
 *    ▼
 * ProductTag
 *
 * ============================================================
 */

export const productTagMappingsTable = pgTable(
    "product_tag_mappings",
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
         * Product Tag
         * ----------------------------------------------------------
         */

        tagId: uuid("tag_id")
            .notNull()
            .references(
                (): AnyPgColumn =>
                    productTagsTable.id,
                {
                    onDelete: "cascade",
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
         * • AI assigned tags
         * • Import information
         * • Future platform extensions
         */

        metadata: jsonb("metadata")
            .$type<ProductTagMappingMetadata>()
            .default(sql`'{}'::jsonb`)
            .notNull(),

        /**
         * ----------------------------------------------------------
         * Audit
         * ----------------------------------------------------------
         */

        /**
         * Seller/Admin who assigned
         * this tag to the product.
         */
        createdBy: uuid("created_by").references(
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

        /**
         * Assignment timestamp.
         */
        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

/**
 * ----------------------------------------------------------
 * Continue in Part 3...
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
         * Prevent duplicate tag assignments
         * for the same product.
         */
        productTagUniqueIdx: uniqueIndex(
            "product_tag_mappings_product_tag_uidx",
        ).on(table.productId, table.tagId),

        /**
         * ==========================================================
         * Foreign Key Lookup Indexes
         * ==========================================================
         */

        /**
         * Used for:
         * Product → Tags
         */
        productIdx: index(
            "product_tag_mappings_product_idx",
        ).on(table.productId),

        /**
         * Used for:
         * Tag → Products
         */
        tagIdx: index(
            "product_tag_mappings_tag_idx",
        ).on(table.tagId),

        /**
         * ==========================================================
         * Audit
         * ==========================================================
         */

        createdByIdx: index(
            "product_tag_mappings_created_by_idx",
        ).on(table.createdBy),

        /**
         * ==========================================================
         * Lifecycle
         * ==========================================================
         */

        createdAtIdx: index(
            "product_tag_mappings_created_at_idx",
        ).on(table.createdAt),

/**
 * ----------------------------------------------------------
 * Continue in Part 4...
 * ----------------------------------------------------------
 */

        /**
         * ==========================================================
         * Database Constraints
         * ==========================================================
         */

        /**
         * Product and Tag must be different
         * valid references.
         *
         * Since both are UUID foreign keys,
         * this constraint primarily prevents
         * accidental NULL/empty UUID values
         * inserted through raw SQL.
         */

        productIdNotEmptyCheck: check(
            "product_tag_mappings_product_id_not_empty_check",
            sql`length(trim(${table.productId}::text)) > 0`,
        ),

        tagIdNotEmptyCheck: check(
            "product_tag_mappings_tag_id_not_empty_check",
            sql`length(trim(${table.tagId}::text)) > 0`,
        ),
    }),
);
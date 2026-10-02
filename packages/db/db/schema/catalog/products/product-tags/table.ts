import { sql } from "drizzle-orm";
import {
    AnyPgColumn,
    boolean,
    check,
    index,
    integer,
    jsonb,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { seller } from "@/db/schema/seller";

import type { ProductTagMetadata } from "./metadata";

import {
    PRODUCT_TAG_COLOR_MAX_LENGTH,
    PRODUCT_TAG_DESCRIPTION_MAX_LENGTH,
    PRODUCT_TAG_ICON_MAX_LENGTH,
    PRODUCT_TAG_NAME_MAX_LENGTH,
    PRODUCT_TAG_SLUG_MAX_LENGTH,
} from "./constants";

/**
 * ============================================================
 * Product Tags
 * ============================================================
 *
 * Stores reusable product tags.
 *
 * Tags are shared across products through
 * the product_tag_mappings table.
 *
 * Examples:
 *
 * • Summer
 * • Organic
 * • Cotton
 * • Trending
 * • Premium
 *
 * ============================================================
 */

export const productTagsTable = pgTable(
    "product_tags",
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
         * Basic Information
         * ----------------------------------------------------------
         */

        /**
         * Human readable tag name.
         *
         * Example:
         * Summer
         */
        name: varchar("name", {
            length: PRODUCT_TAG_NAME_MAX_LENGTH,
        }).notNull(),

        /**
         * SEO friendly unique slug.
         *
         * Example:
         * summer
         */
        slug: varchar("slug", {
            length: PRODUCT_TAG_SLUG_MAX_LENGTH,
        }).notNull(),

        /**
         * Optional tag description.
         */
        description: varchar("description", {
            length:
            PRODUCT_TAG_DESCRIPTION_MAX_LENGTH,
        }),

        /**
         * ----------------------------------------------------------
         * Display
         * ----------------------------------------------------------
         */

        /**
         * UI color.
         *
         * Examples:
         * #22C55E
         * primary
         */
        color: varchar("color", {
            length: PRODUCT_TAG_COLOR_MAX_LENGTH,
        }),

        /**
         * Icon identifier.
         *
         * Examples:
         * leaf
         * flame
         * star
         */
        icon: varchar("icon", {
            length: PRODUCT_TAG_ICON_MAX_LENGTH,
        }),

/**
 * ----------------------------------------------------------
 * Continue in Part 2...
 * ----------------------------------------------------------
 */

        /**
         * ----------------------------------------------------------
         * System Configuration
         * ----------------------------------------------------------
         */

        /**
         * Indicates whether this is a
         * platform-managed system tag.
         *
         * System tags cannot be deleted
         * through normal seller operations.
         *
         * Examples:
         * • Trending
         * • New Arrival
         * • Best Seller
         */
        isSystem: boolean("is_system")
            .default(false)
            .notNull(),

        /**
         * Whether this tag should be
         * highlighted across the platform.
         *
         * Used by:
         * • Homepage
         * • Filters
         * • Collections
         */
        isFeatured: boolean("is_featured")
            .default(false)
            .notNull(),

        /**
         * Display order.
         *
         * Lower values appear first.
         */
        sortOrder: integer("sort_order")
            .default(0)
            .notNull(),

        /**
         * ----------------------------------------------------------
         * Metadata
         * ----------------------------------------------------------
         *
         * Reserved for:
         *
         * • AI generated data
         * • Search analytics
         * • Import metadata
         * • Future platform extensions
         */

        metadata: jsonb("metadata")
            .$type<ProductTagMetadata>()
            .default(sql`'{}'::jsonb`)
            .notNull(),

/**
 * ----------------------------------------------------------
 * Continue in Part 3...
 * ----------------------------------------------------------
 */

        /**
         * ----------------------------------------------------------
         * Audit
         * ----------------------------------------------------------
         */

        /**
         * Seller/Admin who created the tag.
         */
        createdBy: uuid("created_by").references(
            (): AnyPgColumn => seller.id,
            {
                onDelete: "set null",
            },
        ),

        /**
         * Seller/Admin who last updated the tag.
         */
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

        /**
         * Record creation timestamp.
         */
        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

        /**
         * Last update timestamp.
         */
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
         * NOT NULL = Deleted
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
         * Product tag names must be unique.
         */
        nameUniqueIdx: uniqueIndex(
            "product_tags_name_uidx",
        ).on(table.name),

        /**
         * SEO friendly slug must be globally unique.
         */
        slugUniqueIdx: uniqueIndex(
            "product_tags_slug_uidx",
        ).on(table.slug),

        /**
         * ==========================================================
         * Lookup Indexes
         * ==========================================================
         */

        nameIdx: index(
            "product_tags_name_idx",
        ).on(table.name),

        slugIdx: index(
            "product_tags_slug_idx",
        ).on(table.slug),

        /**
         * ==========================================================
         * Filtering Indexes
         * ==========================================================
         */

        featuredIdx: index(
            "product_tags_featured_idx",
        ).on(table.isFeatured),

        systemIdx: index(
            "product_tags_system_idx",
        ).on(table.isSystem),

        sortOrderIdx: index(
            "product_tags_sort_order_idx",
        ).on(table.sortOrder),

        /**
         * ==========================================================
         * Audit Indexes
         * ==========================================================
         */

        createdByIdx: index(
            "product_tags_created_by_idx",
        ).on(table.createdBy),

        updatedByIdx: index(
            "product_tags_updated_by_idx",
        ).on(table.updatedBy),

        /**
         * ==========================================================
         * Lifecycle Indexes
         * ==========================================================
         */

        createdAtIdx: index(
            "product_tags_created_at_idx",
        ).on(table.createdAt),

        deletedAtIdx: index(
            "product_tags_deleted_at_idx",
        ).on(table.deletedAt),

        /**
         * ==========================================================
         * Database Constraints
         * ==========================================================
         */

        nameNotEmptyCheck: check(
            "product_tags_name_not_empty_check",
            sql`length(trim(${table.name})) > 0`,
        ),

        slugNotEmptyCheck: check(
            "product_tags_slug_not_empty_check",
            sql`length(trim(${table.slug})) > 0`,
        ),

        descriptionNotEmptyCheck: check(
            "product_tags_description_not_empty_check",
            sql`${table.description} IS NULL
        OR length(trim(${table.description})) > 0`,
        ),

        colorNotEmptyCheck: check(
            "product_tags_color_not_empty_check",
            sql`${table.color} IS NULL
        OR length(trim(${table.color})) > 0`,
        ),

        iconNotEmptyCheck: check(
            "product_tags_icon_not_empty_check",
            sql`${table.icon} IS NULL
        OR length(trim(${table.icon})) > 0`,
        ),

        sortOrderCheck: check(
            "product_tags_sort_order_check",
            sql`${table.sortOrder} >= 0`,
        ),
    }),
);
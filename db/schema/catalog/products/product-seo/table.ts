import { sql } from "drizzle-orm";
import {
    AnyPgColumn,
    check,
    index,
    jsonb,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

import { seller } from "@/db/schema/seller";

import { productsTable } from "@/db/schema/catalog/products/table";

import { robotsDirectiveEnum } from "@/db/schema/catalog/enums";

import type { ProductSeoMetadata } from "./metadata";

import {
    PRODUCT_SEO_CANONICAL_URL_MAX_LENGTH,
    PRODUCT_SEO_META_DESCRIPTION_MAX_LENGTH,
    PRODUCT_SEO_META_TITLE_MAX_LENGTH,
    PRODUCT_SEO_OG_DESCRIPTION_MAX_LENGTH,
    PRODUCT_SEO_OG_IMAGE_MAX_LENGTH,
    PRODUCT_SEO_OG_TITLE_MAX_LENGTH,
    PRODUCT_SEO_SLUG_MAX_LENGTH,
    PRODUCT_SEO_TWITTER_DESCRIPTION_MAX_LENGTH,
    PRODUCT_SEO_TWITTER_IMAGE_MAX_LENGTH,
    PRODUCT_SEO_TWITTER_TITLE_MAX_LENGTH,
} from "./constants";

/**
 * ============================================================
 * Product SEO
 * ============================================================
 *
 * Stores search engine optimization metadata
 * for a Product.
 *
 * One SEO record exists for each Product.
 *
 * Example
 *
 * Product
 * -------
 * Nike Air Max
 *
 * SEO
 * ---
 * Slug            : nike-air-max
 * Meta Title      : Nike Air Max | Needlon
 * Meta Description: Premium running shoes...
 *
 * ============================================================
 */

export const productSeoTable = pgTable(
    "product_seo",
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
         * URL & Search
         * ----------------------------------------------------------
         */

        /**
         * SEO friendly URL slug.
         *
         * Example:
         * nike-air-max
         */
        slug: varchar("slug", {
            length: PRODUCT_SEO_SLUG_MAX_LENGTH,
        }).notNull(),

        /**
         * Browser title.
         *
         * Recommended:
         * ≤ 60 characters
         */
        metaTitle: varchar("meta_title", {
            length: PRODUCT_SEO_META_TITLE_MAX_LENGTH,
        }),

        /**
         * Search engine description.
         *
         * Recommended:
         * ≤ 160 characters
         */
        metaDescription: varchar(
            "meta_description",
            {
                length:
                PRODUCT_SEO_META_DESCRIPTION_MAX_LENGTH,
            },
        ),

        /**
         * SEO keywords.
         *
         * Stored for:
         * • Internal search
         * • AI optimization
         * • Future integrations
         */
        metaKeywords: text("meta_keywords")
            .array()
            .default(sql`ARRAY[]::text[]`)
            .notNull(),

/**
 * ----------------------------------------------------------
 * Continue in Part 2...
 * ----------------------------------------------------------
 */

        /**
         * ----------------------------------------------------------
         * Canonical URL
         * ----------------------------------------------------------
         */

        /**
         * Canonical URL used by search engines
         * to avoid duplicate content.
         *
         * Example:
         * https://needlon.com/products/nike-air-max
         */
        canonicalUrl: varchar("canonical_url", {
            length: PRODUCT_SEO_CANONICAL_URL_MAX_LENGTH,
        }),

        /**
         * ----------------------------------------------------------
         * Robots Directive
         * ----------------------------------------------------------
         */

        /**
         * Search engine indexing directive.
         *
         * Examples:
         * INDEX_FOLLOW
         * NOINDEX_FOLLOW
         */
        robots: robotsDirectiveEnum("robots")
            .default("INDEX_FOLLOW")
            .notNull(),

        /**
         * ----------------------------------------------------------
         * Open Graph
         * ----------------------------------------------------------
         *
         * Used by:
         * • Facebook
         * • WhatsApp
         * • LinkedIn
         * • Discord
         */

        ogTitle: varchar("og_title", {
            length: PRODUCT_SEO_OG_TITLE_MAX_LENGTH,
        }),

        ogDescription: varchar(
            "og_description",
            {
                length:
                PRODUCT_SEO_OG_DESCRIPTION_MAX_LENGTH,
            },
        ),

        ogImage: varchar("og_image", {
            length: PRODUCT_SEO_OG_IMAGE_MAX_LENGTH,
        }),

        /**
         * ----------------------------------------------------------
         * Twitter Card
         * ----------------------------------------------------------
         */

        twitterTitle: varchar(
            "twitter_title",
            {
                length:
                PRODUCT_SEO_TWITTER_TITLE_MAX_LENGTH,
            },
        ),

        twitterDescription: varchar(
            "twitter_description",
            {
                length:
                PRODUCT_SEO_TWITTER_DESCRIPTION_MAX_LENGTH,
            },
        ),

        twitterImage: varchar(
            "twitter_image",
            {
                length:
                PRODUCT_SEO_TWITTER_IMAGE_MAX_LENGTH,
            },
        ),

        /**
         * ----------------------------------------------------------
         * Structured Data
         * ----------------------------------------------------------
         *
         * JSON-LD used for:
         *
         * • Google Rich Results
         * • Schema.org Product
         * • AI Search
         * • Merchant integrations
         */

        structuredData: jsonb(
            "structured_data",
        )
            .$type<Record<string, unknown>>()
            .default(sql`'{}'::jsonb`)
            .notNull(),

/**
 * ----------------------------------------------------------
 * Continue in Part 3...
 * ----------------------------------------------------------
 */

        /**
         * ----------------------------------------------------------
         * Metadata
         * ----------------------------------------------------------
         *
         * Reserved for:
         *
         * • AI SEO analysis
         * • Import information
         * • Search analytics
         * • Future platform extensions
         */

        metadata: jsonb("metadata")
            .$type<ProductSeoMetadata>()
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
         * One SEO record per product.
         */
        productUniqueIdx: uniqueIndex(
            "product_seo_product_uidx",
        ).on(table.productId),

        /**
         * Globally unique SEO slug.
         */
        slugUniqueIdx: uniqueIndex(
            "product_seo_slug_uidx",
        ).on(table.slug),

        /**
         * ==========================================================
         * Foreign Key Lookup Indexes
         * ==========================================================
         */

        productIdx: index(
            "product_seo_product_idx",
        ).on(table.productId),

        /**
         * ==========================================================
         * SEO Query Indexes
         * ==========================================================
         */

        slugIdx: index(
            "product_seo_slug_idx",
        ).on(table.slug),

        robotsIdx: index(
            "product_seo_robots_idx",
        ).on(table.robots),

        /**
         * ==========================================================
         * Audit
         * ==========================================================
         */

        createdByIdx: index(
            "product_seo_created_by_idx",
        ).on(table.createdBy),

        updatedByIdx: index(
            "product_seo_updated_by_idx",
        ).on(table.updatedBy),

        /**
         * ==========================================================
         * Lifecycle
         * ==========================================================
         */

        createdAtIdx: index(
            "product_seo_created_at_idx",
        ).on(table.createdAt),

        deletedAtIdx: index(
            "product_seo_deleted_at_idx",
        ).on(table.deletedAt),

        /**
         * ==========================================================
         * Database Constraints
         * ==========================================================
         */

        slugNotEmptyCheck: check(
            "product_seo_slug_not_empty_check",
            sql`length(trim(${table.slug})) > 0`,
        ),

        metaTitleNotEmptyCheck: check(
            "product_seo_meta_title_not_empty_check",
            sql`${table.metaTitle} IS NULL
        OR length(trim(${table.metaTitle})) > 0`,
        ),

        metaDescriptionNotEmptyCheck: check(
            "product_seo_meta_description_not_empty_check",
            sql`${table.metaDescription} IS NULL
        OR length(trim(${table.metaDescription})) > 0`,
        ),

        canonicalUrlNotEmptyCheck: check(
            "product_seo_canonical_url_not_empty_check",
            sql`${table.canonicalUrl} IS NULL
        OR length(trim(${table.canonicalUrl})) > 0`,
        ),
    }),
);
import { sql } from "drizzle-orm";
import {
    AnyPgColumn,
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

import type { ProductAiMetadata } from "./metadata";

import {
    PRODUCT_AI_MODEL_MAX_LENGTH,
    PRODUCT_AI_MODERATION_REASON_MAX_LENGTH,
    PRODUCT_AI_SEO_DESCRIPTION_MAX_LENGTH,
    PRODUCT_AI_SEO_TITLE_MAX_LENGTH,
    PRODUCT_AI_SUMMARY_MAX_LENGTH,
} from "./constants";
import {aiModerationStatusEnum} from "@/db/schema/catalog/enums";

/**
 * ============================================================
 * Product AI
 * ============================================================
 *
 * Stores AI-generated enrichments for products.
 *
 * This table contains derived content and
 * optimization data that can be regenerated
 * without affecting the core product record.
 *
 * Relationship:
 *
 * Product (1) ---------- (1) Product AI
 *
 * ============================================================
 */

export const productAiTable = pgTable(
    "product_ai",
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

        /**
         * Associated product.
         *
         * One Product
         *      ↓
         * One Product AI Record
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
         * AI Generated Content
         * ----------------------------------------------------------
         */

        /**
         * AI-generated product summary.
         */
        summary: varchar("summary", {
            length: PRODUCT_AI_SUMMARY_MAX_LENGTH,
        }),

        /**
         * AI-generated SEO title.
         */
        seoTitle: varchar("seo_title", {
            length: PRODUCT_AI_SEO_TITLE_MAX_LENGTH,
        }),

        /**
         * AI-generated SEO description.
         */
        seoDescription: varchar(
            "seo_description",
            {
                length:
                PRODUCT_AI_SEO_DESCRIPTION_MAX_LENGTH,
            },
        ),

/**
 * ----------------------------------------------------------
 * Continue in Part 2...
 * ----------------------------------------------------------
 */

        /**
         * ----------------------------------------------------------
         * AI Generated Data
         * ----------------------------------------------------------
         */

        /**
         * AI suggested product tags.
         *
         * These are recommendations only and
         * are NOT automatically inserted into
         * product_tag_mappings.
         *
         * Example:
         * [
         *   "cotton",
         *   "summer",
         *   "casual"
         * ]
         */
        generatedTags: jsonb("generated_tags")
            .$type<string[]>()
            .default(sql`'[]'::jsonb`)
            .notNull(),

        /**
         * AI extracted product attributes.
         *
         * Example:
         * {
         *   "fabric": "Cotton",
         *   "fit": "Regular",
         *   "occasion": "Casual"
         * }
         */
        generatedAttributes: jsonb(
            "generated_attributes",
        )
            .$type<Record<string, unknown>>()
            .default(sql`'{}'::jsonb`)
            .notNull(),

        /**
         * Product embedding.
         *
         * Reserved for future vector search.
         *
         * Current:
         * jsonb
         *
         * Future:
         * pgvector
         */
        embedding: jsonb("embedding")
            .$type<number[] | null>(),

        /**
         * ----------------------------------------------------------
         * AI Scores
         * ----------------------------------------------------------
         */

        /**
         * Overall AI quality score.
         *
         * Range:
         * 0 - 100
         */
        qualityScore: integer(
            "quality_score",
        )
            .default(0)
            .notNull(),

        /**
         * Search relevance score.
         *
         * Range:
         * 0 - 100
         */
        searchScore: integer(
            "search_score",
        )
            .default(0)
            .notNull(),

        /**
         * Product completeness score.
         *
         * Range:
         * 0 - 100
         */
        completenessScore: integer(
            "completeness_score",
        )
            .default(0)
            .notNull(),

/**
 * ----------------------------------------------------------
 * Continue in Part 3...
 * ----------------------------------------------------------
 */

        /**
         * ----------------------------------------------------------
         * AI Moderation
         * ----------------------------------------------------------
         */

        /**
         * Current moderation status.
         */
        moderationStatus: aiModerationStatusEnum(
            "moderation_status",
        )
            .default("PENDING")
            .notNull(),

        /**
         * Moderation explanation.
         *
         * Populated when moderation fails
         * or requires manual review.
         */
        moderationReason: varchar(
            "moderation_reason",
            {
                length:
                PRODUCT_AI_MODERATION_REASON_MAX_LENGTH,
            },
        ),

        /**
         * ----------------------------------------------------------
         * AI Generation
         * ----------------------------------------------------------
         */

        /**
         * Last AI model used to generate
         * this record.
         *
         * Examples:
         * - gpt-5.5
         * - gemini-2.5-pro
         * - claude-opus-4
         * - needlon-ai-v1
         */
        lastModel: varchar(
            "last_model",
            {
                length:
                PRODUCT_AI_MODEL_MAX_LENGTH,
            },
        ),

        /**
         * Last successful AI generation time.
         */
        lastGeneratedAt: timestamp(
            "last_generated_at",
            {
                withTimezone: true,
            },
        ),

        /**
         * ----------------------------------------------------------
         * Metadata
         * ----------------------------------------------------------
         */

        metadata: jsonb("metadata")
            .$type<ProductAiMetadata>()
            .default(sql`'{}'::jsonb`)
            .notNull(),

        /**
         * ----------------------------------------------------------
         * Audit
         * ----------------------------------------------------------
         */

        /**
         * Seller/Admin who created
         * this AI record.
         */
        createdBy: uuid("created_by").references(
            (): AnyPgColumn => seller.id,
            {
                onDelete: "set null",
            },
        ),

        /**
         * Seller/Admin who last updated
         * this AI record.
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
        createdAt: timestamp(
            "created_at",
            {
                withTimezone: true,
            },
        )
            .defaultNow()
            .notNull(),

        /**
         * Last update timestamp.
         */
        updatedAt: timestamp(
            "updated_at",
            {
                withTimezone: true,
            },
        )
            .defaultNow()
            .notNull(),

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
         * One Product
         *        ↓
         * One AI Record
         */
        productUniqueIdx: uniqueIndex(
            "product_ai_product_uidx",
        ).on(table.productId),

        /**
         * ==========================================================
         * Lookup Indexes
         * ==========================================================
         */

        productIdx: index(
            "product_ai_product_idx",
        ).on(table.productId),

        moderationStatusIdx: index(
            "product_ai_moderation_status_idx",
        ).on(table.moderationStatus),

        qualityScoreIdx: index(
            "product_ai_quality_score_idx",
        ).on(table.qualityScore),

        searchScoreIdx: index(
            "product_ai_search_score_idx",
        ).on(table.searchScore),

        completenessScoreIdx: index(
            "product_ai_completeness_score_idx",
        ).on(table.completenessScore),

        lastGeneratedAtIdx: index(
            "product_ai_last_generated_at_idx",
        ).on(table.lastGeneratedAt),

        /**
         * ==========================================================
         * Audit Indexes
         * ==========================================================
         */

        createdByIdx: index(
            "product_ai_created_by_idx",
        ).on(table.createdBy),

        updatedByIdx: index(
            "product_ai_updated_by_idx",
        ).on(table.updatedBy),

        createdAtIdx: index(
            "product_ai_created_at_idx",
        ).on(table.createdAt),

        updatedAtIdx: index(
            "product_ai_updated_at_idx",
        ).on(table.updatedAt),

        /**
         * ==========================================================
         * Database Constraints
         * ==========================================================
         */

        summaryNotEmptyCheck: check(
            "product_ai_summary_not_empty_check",
            sql`${table.summary} IS NULL
        OR length(trim(${table.summary})) > 0`,
        ),

        seoTitleNotEmptyCheck: check(
            "product_ai_seo_title_not_empty_check",
            sql`${table.seoTitle} IS NULL
        OR length(trim(${table.seoTitle})) > 0`,
        ),

        seoDescriptionNotEmptyCheck: check(
            "product_ai_seo_description_not_empty_check",
            sql`${table.seoDescription} IS NULL
        OR length(trim(${table.seoDescription})) > 0`,
        ),

        moderationReasonNotEmptyCheck: check(
            "product_ai_moderation_reason_not_empty_check",
            sql`${table.moderationReason} IS NULL
        OR length(trim(${table.moderationReason})) > 0`,
        ),

        lastModelNotEmptyCheck: check(
            "product_ai_last_model_not_empty_check",
            sql`${table.lastModel} IS NULL
        OR length(trim(${table.lastModel})) > 0`,
        ),

        qualityScoreCheck: check(
            "product_ai_quality_score_check",
            sql`${table.qualityScore} >= 0
        AND ${table.qualityScore} <= 100`,
        ),

        searchScoreCheck: check(
            "product_ai_search_score_check",
            sql`${table.searchScore} >= 0
        AND ${table.searchScore} <= 100`,
        ),

        completenessScoreCheck: check(
            "product_ai_completeness_score_check",
            sql`${table.completenessScore} >= 0
        AND ${table.completenessScore} <= 100`,
        ),
    }),
);
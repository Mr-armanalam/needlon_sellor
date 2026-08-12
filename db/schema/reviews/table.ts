// ============================================================================
// Needlon
// Reviews Module
// File: db/schema/reviews/table.ts
// Description: Reviews table
// Phase: 1.4 - Review Database Foundation
// ============================================================================

import {
    boolean,
    check,
    index, integer,
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { seller } from "@/db/schema/seller";
import { usersTable } from "@/db/schema/users";
import { productsTable } from "@/db/schema/catalog/products/table";

import {
    REVIEW_CONTENT_MAX_LENGTH,
    REVIEW_MAX_RATING,
    REVIEW_MIN_RATING,
    REVIEW_TITLE_MAX_LENGTH,
} from "./constants";

import type { ReviewMetadata } from "./metadata";

/**
 * ============================================================================
 * Reviews
 * ============================================================================
 *
 * Root entity representing a buyer review associated with a product.
 *
 * The review keeps its core business data explicitly represented in columns.
 * Additional non-core information may be stored in metadata.
 *
 * Seller
 *      │
 *      ▼
 *   Review
 *      │
 *      ├────────► Buyer
 *      └────────► Product
 *
 * ============================================================================
 */

export const reviewsTable = pgTable(
    "reviews",
    {
        /**
         * --------------------------------------------------------------------
         * Identity
         * --------------------------------------------------------------------
         */

        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        /**
         * --------------------------------------------------------------------
         * Seller Ownership
         * --------------------------------------------------------------------
         */

        sellerId: uuid("seller_id")
            .notNull()
            .references(
                () => seller.id,
                {
                    onDelete: "restrict",
                    onUpdate: "cascade",
                },
            ),

        /**
         * --------------------------------------------------------------------
         * Buyer
         * --------------------------------------------------------------------
         */

        buyerId: uuid("buyer_id")
            .notNull()
            .references(
                () => usersTable.id,
                {
                    onDelete: "restrict",
                    onUpdate: "cascade",
                },
            ),

        /**
         * --------------------------------------------------------------------
         * Product
         * --------------------------------------------------------------------
         */

        productId: uuid("product_id")
            .notNull()
            .references(
                () => productsTable.id,
                {
                    onDelete: "restrict",
                    onUpdate: "cascade",
                },
            ),

        /**
         * --------------------------------------------------------------------
         * Review Content
         * --------------------------------------------------------------------
         */

        rating: integer("rating")
            .notNull(),

        title: varchar(
            "title",
            {
                length: REVIEW_TITLE_MAX_LENGTH,
            },
        ),

        content: text("content"),

        /**
         * --------------------------------------------------------------------
         * Buyer Verification
         * --------------------------------------------------------------------
         */

        isVerifiedBuyer: boolean(
            "is_verified_buyer",
        )
            .notNull()
            .default(false),

        /**
         * --------------------------------------------------------------------
         * Review Status
         * --------------------------------------------------------------------
         *
         * Status values are defined in constants.ts and are implemented as
         * a database text column until the dedicated status-definition step
         * establishes the approved status representation.
         * --------------------------------------------------------------------
         */

        status: varchar(
            "status",
            {
                length: 50,
            },
        )
            .notNull()
            .default("PUBLISHED"),

        /**
         * --------------------------------------------------------------------
         * Metadata
         * --------------------------------------------------------------------
         */

        metadata: jsonb(
            "metadata",
        ).$type<ReviewMetadata | null>(),

        /**
         * --------------------------------------------------------------------
         * Timestamps
         * --------------------------------------------------------------------
         */

        createdAt: timestamp(
            "created_at",
            {
                withTimezone: true,
            },
        )
            .defaultNow()
            .notNull(),

        updatedAt: timestamp(
            "updated_at",
            {
                withTimezone: true,
            },
        )
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),

        /**
         * --------------------------------------------------------------------
         * Soft Delete
         * --------------------------------------------------------------------
         */

        deletedAt: timestamp(
            "deleted_at",
            {
                withTimezone: true,
            },
        ),
    },

    (table) => ({
        /**
         * --------------------------------------------------------------------
         * Rating Constraint
         * --------------------------------------------------------------------
         */

        ratingRangeCheck: check(
            "reviews_rating_range_check",
            sql`${table.rating} >= ${REVIEW_MIN_RATING} AND ${table.rating} <= ${REVIEW_MAX_RATING}`,
        ),

        /**
         * --------------------------------------------------------------------
         * Seller Lookup
         * --------------------------------------------------------------------
         */

        sellerIdx: index(
            "reviews_seller_idx",
        ).on(
            table.sellerId,
        ),

        sellerStatusIdx: index(
            "reviews_seller_status_idx",
        ).on(
            table.sellerId,
            table.status,
        ),

        sellerCreatedAtIdx: index(
            "reviews_seller_created_at_idx",
        ).on(
            table.sellerId,
            table.createdAt,
        ),

        /**
         * --------------------------------------------------------------------
         * Buyer Lookup
         * --------------------------------------------------------------------
         */

        buyerIdx: index(
            "reviews_buyer_idx",
        ).on(
            table.buyerId,
        ),

        buyerCreatedAtIdx: index(
            "reviews_buyer_created_at_idx",
        ).on(
            table.buyerId,
            table.createdAt,
        ),

        /**
         * --------------------------------------------------------------------
         * Product Lookup
         * --------------------------------------------------------------------
         */

        productIdx: index(
            "reviews_product_idx",
        ).on(
            table.productId,
        ),

        productRatingIdx: index(
            "reviews_product_rating_idx",
        ).on(
            table.productId,
            table.rating,
        ),

        productStatusIdx: index(
            "reviews_product_status_idx",
        ).on(
            table.productId,
            table.status,
        ),

        /**
         * --------------------------------------------------------------------
         * Rating Filtering
         * --------------------------------------------------------------------
         */

        ratingIdx: index(
            "reviews_rating_idx",
        ).on(
            table.rating,
        ),

        sellerRatingIdx: index(
            "reviews_seller_rating_idx",
        ).on(
            table.sellerId,
            table.rating,
        ),

        /**
         * --------------------------------------------------------------------
         * Verification
         * --------------------------------------------------------------------
         */

        verifiedBuyerIdx: index(
            "reviews_verified_buyer_idx",
        ).on(
            table.isVerifiedBuyer,
        ),

        sellerVerifiedBuyerIdx: index(
            "reviews_seller_verified_buyer_idx",
        ).on(
            table.sellerId,
            table.isVerifiedBuyer,
        ),

        /**
         * --------------------------------------------------------------------
         * Status
         * --------------------------------------------------------------------
         */

        statusIdx: index(
            "reviews_status_idx",
        ).on(
            table.status,
        ),

        /**
         * --------------------------------------------------------------------
         * Review Timeline
         * --------------------------------------------------------------------
         */

        createdAtIdx: index(
            "reviews_created_at_idx",
        ).on(
            table.createdAt,
        ),

        updatedAtIdx: index(
            "reviews_updated_at_idx",
        ).on(
            table.updatedAt,
        ),

        sellerTimelineIdx: index(
            "reviews_seller_timeline_idx",
        ).on(
            table.sellerId,
            table.status,
            table.createdAt,
        ),

        /**
         * --------------------------------------------------------------------
         * Soft Delete
         * --------------------------------------------------------------------
         */

        deletedAtIdx: index(
            "reviews_deleted_at_idx",
        ).on(
            table.deletedAt,
        ),

        activeReviewsIdx: index(
            "reviews_active_idx",
        ).on(
            table.deletedAt,
            table.status,
        ),
    }),
);



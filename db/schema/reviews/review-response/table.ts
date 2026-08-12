import {
    index,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";

import {
    reviewsTable,
} from "./table";

import {
    seller,
} from "@/db/schema/seller";

/**
 * ============================================================================
 * Seller Review Responses
 * ============================================================================
 *
 * A seller may publish one response to a customer review.
 *
 * Ownership is enforced through both:
 *
 * - reviewId -> reviewsTable.id
 * - sellerId -> seller.id
 *
 * The unique review constraint guarantees one response per review.
 * ============================================================================
 */

export const sellerReviewResponsesTable = pgTable(
    "seller_review_responses",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        reviewId: uuid("review_id")
            .notNull()
            .references(
                () => reviewsTable.id,
                {
                    onDelete: "cascade",
                    onUpdate: "cascade",
                },
            ),

        sellerId: uuid("seller_id")
            .notNull()
            .references(
                () => seller.id,
                {
                    onDelete: "restrict",
                    onUpdate: "cascade",
                },
            ),

        content: text("content")
            .notNull(),

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
            .$onUpdate(
                () => new Date(),
            )
            .notNull(),
    },

    (table) => ({
        reviewUniqueIdx:
            uniqueIndex(
                "seller_review_responses_review_uidx",
            ).on(
                table.reviewId,
            ),

        reviewIdx:
            index(
                "seller_review_responses_review_idx",
            ).on(
                table.reviewId,
            ),

        sellerIdx:
            index(
                "seller_review_responses_seller_idx",
            ).on(
                table.sellerId,
            ),

        sellerReviewIdx:
            index(
                "seller_review_responses_seller_review_idx",
            ).on(
                table.sellerId,
                table.reviewId,
            ),
    }),
);

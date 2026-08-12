import {
    eq,
} from "drizzle-orm";

import {
    getDatabase,
} from "@/db/database";

import type {
    DbTransaction,
} from "@/db/transactions";

import {
    sellerReviewResponsesTable,
} from "@/db/schema/reviews/review-responses";

interface CreateReviewResponseCommandParams {
    reviewId: string;

    sellerId: string;

    content: string;

    tx?: DbTransaction;
}

export async function createReviewResponseCommand({
                                                      reviewId,
                                                      sellerId,
                                                      content,
                                                      tx,
                                                  }: CreateReviewResponseCommandParams) {
    const database =
        getDatabase(tx);

    const existing =
        await database
            .select({
                id:
                sellerReviewResponsesTable.id,
            })
            .from(
                sellerReviewResponsesTable,
            )
            .where(
                eq(
                    sellerReviewResponsesTable.reviewId,
                    reviewId,
                ),
            )
            .limit(1);

    if (existing.length > 0) {
        throw new Error(
            "A seller response already exists for this review.",
        );
    }

    const [
        response,
    ] =
        await database
            .insert(
                sellerReviewResponsesTable,
            )
            .values({
                reviewId,

                sellerId,

                content,
            })
            .returning();

    if (!response) {
        throw new Error(
            "Unable to create seller review response.",
        );
    }

    return response;
}

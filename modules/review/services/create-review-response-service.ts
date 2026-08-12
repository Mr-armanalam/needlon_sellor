import {
    eq,
} from "drizzle-orm";

import {
    getDatabase,
} from "@/db/database";

import {
    reviewsTable,
} from "@/db/schema/reviews";

import {
    createReviewResponseCommand,
} from "../repository";

import type {
    ReviewResponseDto,
} from "../dto/review-response.dto";

interface CreateReviewResponseServiceParams {
    sellerId: string;

    reviewId: string;

    content: string;
}

export async function createReviewResponseService({
                                                      sellerId,
                                                      reviewId,
                                                      content,
                                                  }: CreateReviewResponseServiceParams): Promise<ReviewResponseDto> {
    const database =
        getDatabase();

    const review =
        await database
            .select({
                id:
                reviewsTable.id,

                sellerId:
                reviewsTable.sellerId,
            })
            .from(
                reviewsTable,
            )
            .where(
                eq(
                    reviewsTable.id,
                    reviewId,
                ),
            )
            .limit(1);

    const targetReview =
        review[0];

    if (!targetReview) {
        throw new Error(
            "Review not found.",
        );
    }

    if (
        targetReview.sellerId !==
        sellerId
    ) {
        throw new Error(
            "You are not authorized to respond to this review.",
        );
    }

    const response =
        await createReviewResponseCommand(
            {
                reviewId,

                sellerId,

                content,
            },
        );

    return {
        id:
        response.id,

        reviewId:
        response.reviewId,

        sellerId:
        response.sellerId,

        content:
        response.content,

        createdAt:
        response.createdAt,

        updatedAt:
        response.updatedAt,
    };
}

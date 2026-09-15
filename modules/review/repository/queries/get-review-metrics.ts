import {
    and,
    eq,
    isNull,
    sql,
} from "drizzle-orm";

import { getDatabase } from "@/db/database";

import {
    reviewsTable,
} from "@/db/schema/reviews";

import {
    sellerReviewResponsesTable,
} from "@/db/schema/reviews/review-response/table";

import {
    reviewReportsTable,
} from "@/db/schema/reviews/review-reports/table";

interface GetReviewMetricsParams {
    sellerId: string;
}

export async function getReviewMetrics({
                                           sellerId,
                                       }: GetReviewMetricsParams) {
    const database =
        getDatabase();

    const activeReviewCondition =
        and(
            eq(
                reviewsTable.sellerId,
                sellerId,
            ),
            isNull(
                reviewsTable.deletedAt,
            ),
        );

    const [
        result,
    ] =
        await database
            .select({
                averageRating:
                    sql<number | null>`
                        avg(
                            ${reviewsTable.rating}
                        )
                    `,

                totalReviews:
                    sql<number>`
                        count(
                            ${reviewsTable.id}
                        )::int
                    `,
            })
            .from(
                reviewsTable,
            )
            .where(
                activeReviewCondition,
            );

    const [
        replyResult,
    ] =
        await database
            .select({
                totalReplies:
                    sql<number>`
                        count(
                            distinct ${sellerReviewResponsesTable.reviewId}
                        )::int
                    `,
            })
            .from(
                sellerReviewResponsesTable,
            )
            .innerJoin(
                reviewsTable,
                eq(
                    sellerReviewResponsesTable.reviewId,
                    reviewsTable.id,
                ),
            )
            .where(
                activeReviewCondition,
            );

    const [
        reportResult,
    ] =
        await database
            .select({
                pendingReports:
                    sql<number>`
                        count(*)::int
                    `,
            })
            .from(
                reviewReportsTable,
            )
            .innerJoin(
                reviewsTable,
                eq(
                    reviewReportsTable.reviewId,
                    reviewsTable.id,
                ),
            )
            .where(
                and(
                    activeReviewCondition,
                    eq(
                        reviewReportsTable.status,
                        "PENDING",
                    ),
                ),
            );

    const totalReviews =
        Number(
            result?.totalReviews ?? 0,
        );

    const totalReplies =
        Number(
            replyResult?.totalReplies ?? 0,
        );

    const averageRating =
        result?.averageRating === null ||
        result?.averageRating === undefined
            ? 0
            : Number(
                result.averageRating,
            );

    const replyRate =
        totalReviews === 0
            ? 0
            : (
                (totalReplies /
                    totalReviews) *
                100
            );

    return {
        averageRating:
            Number(
                averageRating.toFixed(
                    2,
                ),
            ),

        totalReviews,

        totalReplies,

        replyRate:
            Number(
                replyRate.toFixed(
                    2,
                ),
            ),

        pendingReports:
            Number(
                reportResult?.pendingReports ??
                0,
            ),
    };
}

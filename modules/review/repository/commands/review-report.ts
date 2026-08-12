import {
    and,
    eq,
    isNull,
} from "drizzle-orm";

import {
    getDatabase,
} from "@/db/database";

import type {
    DbTransaction,
} from "@/db/transactions";

import {
    reviewsTable,
} from "@/db/schema/reviews";

import {
    reviewReportsTable,
} from "@/db/schema/reviews/review-reports/table";

interface CreateReviewReportParams {
    reviewId: string;

    sellerId: string;

    reason: string;

    tx?: DbTransaction;
}

export async function createReviewReport({
                                             reviewId,
                                             sellerId,
                                             reason,
                                             tx,
                                         }: CreateReviewReportParams) {
    const database =
        getDatabase(tx);

    const review =
        await database
            .select({
                id:
                reviewsTable.id,

                sellerId:
                reviewsTable.sellerId,

                status:
                reviewsTable.status,
            })
            .from(
                reviewsTable,
            )
            .where(
                and(
                    eq(
                        reviewsTable.id,
                        reviewId,
                    ),
                    eq(
                        reviewsTable.sellerId,
                        sellerId,
                    ),
                    isNull(
                        reviewsTable.deletedAt,
                    ),
                ),
            )
            .limit(1);

    const existingReview =
        review[0];

    if (!existingReview) {
        throw new Error(
            "REVIEW_NOT_FOUND",
        );
    }

    const existingReport =
        await database
            .select({
                id:
                reviewReportsTable.id,
            })
            .from(
                reviewReportsTable,
            )
            .where(
                and(
                    eq(
                        reviewReportsTable.reviewId,
                        reviewId,
                    ),
                    eq(
                        reviewReportsTable.sellerId,
                        sellerId,
                    ),
                    eq(
                        reviewReportsTable.status,
                        "PENDING",
                    ),
                ),
            )
            .limit(1);

    if (existingReport[0]) {
        throw new Error(
            "REVIEW_ALREADY_REPORTED",
        );
    }

    const [report] =
        await database
            .insert(
                reviewReportsTable,
            )
            .values({
                reviewId,
                sellerId,
                reason: reason.trim(),
                status: "PENDING",
            })
            .returning();

    if (!report) {
        throw new Error(
            "REVIEW_REPORT_CREATION_FAILED",
        );
    }

    return report;
}

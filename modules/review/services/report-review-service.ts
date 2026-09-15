import {
    createReviewReport,
} from "../repository";

import type {
    ReviewReportDto,
} from "../dto/report-review.dto";

import {
    reportReviewSchema,
} from "../schema/report-review-schema";

interface ReportReviewServiceParams {
    sellerId: string;

    reviewId: string;

    reason: string;
}

export async function reportReviewService({
                                              sellerId,
                                              reviewId,
                                              reason,
                                          }: ReportReviewServiceParams): Promise<ReviewReportDto> {
    const parsed =
        reportReviewSchema.parse({
            reviewId,
            reason,
        });

    const report =
        await createReviewReport({
            sellerId,
            reviewId:
            parsed.reviewId,
            reason:
            parsed.reason,
        });

    return {
        id:
        report.id,

        reviewId:
        report.reviewId,

        sellerId:
        report.sellerId,

        reason:
        report.reason,

        status:
            report.status as ReviewReportDto["status"],

        createdAt:
        report.createdAt,

        updatedAt:
        report.updatedAt,
    };
}

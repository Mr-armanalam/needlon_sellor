import type {
    ReviewReportStatus,
} from "@/db/schema/reviews/review-reports/type";

export interface ReportReviewDto {
    reviewId: string;

    reason: string;
}

export interface ReviewReportDto {
    id: string;

    reviewId: string;

    sellerId: string;

    reason: string;

    status: ReviewReportStatus;

    createdAt: Date;

    updatedAt: Date;
}
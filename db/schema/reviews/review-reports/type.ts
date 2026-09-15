
export type ReviewReportId = string;

export type ReviewReportReason = string;

export type ReviewReportStatus =
    | "PENDING"
    | "RESOLVED"
    | "DISMISSED";

export interface ReviewReport {
    id: ReviewReportId;

    reviewId: string;

    sellerId: string;

    reason: ReviewReportReason;

    status: ReviewReportStatus;

    createdAt: Date;

    updatedAt: Date;
}
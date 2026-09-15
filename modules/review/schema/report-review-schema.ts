import {
    z,
} from "zod";

import {
    REVIEW_REPORT_REASON_MAX_LENGTH,
} from "@/db/schema/reviews/review-reports/constants";

export const reportReviewSchema =
    z.object({
        reviewId: z
            .string()
            .uuid(),

        reason: z
            .string()
            .trim()
            .min(
                1,
                "A report reason is required.",
            )
            .max(
                REVIEW_REPORT_REASON_MAX_LENGTH,
                "The report reason is too long.",
            ),
    });

export type ReportReviewInput =
    z.infer<
        typeof reportReviewSchema
    >;

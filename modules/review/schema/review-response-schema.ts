
import {
    z,
} from "zod";

import {
    REVIEW_RESPONSE_MAX_LENGTH,
    REVIEW_RESPONSE_MIN_LENGTH,
} from "@/db/schema/reviews/review-response/constants";

export const createReviewResponseSchema =
    z.object({
        reviewId:
            z.string()
                .uuid(),

        content:
            z.string()
                .trim()
                .min(
                    REVIEW_RESPONSE_MIN_LENGTH,
                    "Response cannot be empty.",
                )
                .max(
                    REVIEW_RESPONSE_MAX_LENGTH,
                    "Response is too long.",
                ),
    });

export type CreateReviewResponseInput =
    z.infer<
        typeof createReviewResponseSchema
    >;


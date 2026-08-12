import {
    apiClient,
} from "@/modules/shared/api/api-client";

import type {
    ReviewResponseDto,
} from "../dto/review-response.dto";

export interface CreateReviewResponseRequest {
    reviewId: string;

    content: string;
}

export async function createReviewResponse(
    input: CreateReviewResponseRequest,
) {
    return apiClient.post<ReviewResponseDto>(
        "/api/seller/reviews/response",
        input,
    );
}
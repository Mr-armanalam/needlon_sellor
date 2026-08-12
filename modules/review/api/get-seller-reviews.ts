// ============================================================================
// Needlon
// Reviews Module
// File: modules/reviews/api/get-seller-reviews.ts
// Description: Seller review list API client
// Phase: 4.1
// ============================================================================

import { apiClient } from "@/modules/shared/api";

import type {
    ReviewListDto,
} from "../dto/review.dto";

import type {
    ListReviewsQueryDto,
} from "../dto/list-reviews-query.dto";

export async function getSellerReviews(
    query?: ListReviewsQueryDto,
) {
    const params =
        new URLSearchParams();

    if (
        query?.page !== undefined
    ) {
        params.set(
            "page",
            String(query.page),
        );
    }

    if (
        query?.limit !== undefined
    ) {
        params.set(
            "limit",
            String(query.limit),
        );
    }

    if (
        query?.search
    ) {
        params.set(
            "search",
            query.search,
        );
    }

    if (
        query?.rating !== undefined
    ) {
        params.set(
            "rating",
            String(query.rating),
        );
    }

    const queryString =
        params.toString();

    return apiClient.get<ReviewListDto>(
        `/seller/reviews${
            queryString
                ? `?${queryString}`
                : ""
        }`,
    );
}
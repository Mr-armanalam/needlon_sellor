// ============================================================================
// Needlon
// Reviews Module
// File: modules/reviews/hooks/use-seller-reviews.ts
// Description: Seller reviews query with search and rating filtering
// Phase: 6.2 - 6.5
// ============================================================================

"use client";

import {
    useQuery,
} from "@tanstack/react-query";

import {
    getSellerReviews,
} from "../api/get-seller-reviews";

import {
    reviewsKeys,
} from "../keys";

import type {
    ListReviewsQueryDto,
} from "../dto/list-reviews-query.dto";

export function useSellerReviews(
    query: ListReviewsQueryDto = {},
) {
    const normalizedQuery = {
        page:
        query.page,

        limit:
        query.limit,

        search:
            query.search?.trim() ||
            undefined,

        rating:
        query.rating,
    };

    return useQuery({
        queryKey:
            reviewsKeys.list(
                normalizedQuery,
            ),

        queryFn:
            () =>
                getSellerReviews(
                    normalizedQuery,
                ),

        staleTime:
            30_000,
    });
}
// ============================================================================
// Needlon
// Reviews Module
// File: modules/reviews/services/list-reviews-service.ts
// Description: Seller review list application service
// Phase: 3.3 - 3.6
// ============================================================================

import {
    listSellerReviews,
} from "../repository";

import {
    toReviewDto,
} from "../mapper/to-review-dto";

import type {
    ReviewListDto,
} from "../dto/review.dto";

interface ListReviewsServiceParams {
    sellerId: string;

    page?: number;

    limit?: number;

    search?: string;

    rating?: number;
}

/**
 * Lists reviews belonging to the requested seller.
 *
 * Seller ownership is passed explicitly into the repository query.
 * The service does not accept a seller identifier from arbitrary
 * review data; the caller must provide the authenticated seller scope.
 */
export async function listReviewsService({
                                             sellerId,
                                             page,
                                             limit,
                                             search,
                                             rating,
                                         }: ListReviewsServiceParams): Promise<ReviewListDto> {
    const result =
        await listSellerReviews({
            sellerId,

            page,

            limit,

            search,

            rating,
        });

    return {
        items:
            result.items.map(
                toReviewDto,
            ),

        pagination: {
            page:
            result.pagination.page,

            limit:
            result.pagination.limit,

            total:
            result.pagination.total,

            totalPages:
            result.pagination.totalPages,
        },
    };
}
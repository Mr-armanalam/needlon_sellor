// ============================================================================
// Needlon
// Reviews Module
// File: modules/reviews/lib/to-review-list-item.ts
// Description: Review DTO to UI view-model mapping
// Phase: 5.4
// ============================================================================

import type {
    ReviewDto,
} from "../dto/review.dto";

export interface ReviewListItem {
    id: string;

    buyer: {
        id: string;

        name: string;

        email: string;

        imageUrl: string | null;
    };

    product: {
        id: string;

        name: string;

        slug: string;
    };

    rating: number;

    title: string | null;

    content: string | null;

    status: ReviewDto["status"];

    createdAt: Date;

    updatedAt: Date;
}

export function toReviewListItem(
    review: ReviewDto,
): ReviewListItem {
    return {
        id: review.id,

        buyer: {
            id:
            review.buyer.id,

            name:
            review.buyer.name,

            email:
            review.buyer.email,

            imageUrl:
            review.buyer.imageUrl,
        },

        product: {
            id:
            review.product.id,

            name:
            review.product.name,

            slug:
            review.product.slug,
        },

        rating:
        review.rating,

        title:
        review.title,

        content:
        review.content,

        status:
        review.status,

        createdAt:
        review.createdAt,

        updatedAt:
        review.updatedAt,
    };
}
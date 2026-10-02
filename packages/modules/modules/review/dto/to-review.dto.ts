// ============================================================================
// Needlon
// Reviews Module
// File: modules/reviews/mapper/to-review.dto.ts
// Description: Review repository result to response DTO mapper
// Phase: 3.2
// ============================================================================

import type {
    ReviewDto,
} from "../dto/review.dto";

type ReviewRepositoryResult = {
    id: string;

    sellerId: string;

    buyerId: string;

    productId: string;

    rating: number;

    title: string | null;

    content: string | null;

    status: string;

    createdAt: Date;

    updatedAt: Date;

    reply: string | null;

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
};

export function toReviewDto(
    review: ReviewRepositoryResult,
): ReviewDto {
    return {
        id: review.id,

        sellerId:
        review.sellerId,

        buyerId:
        review.buyerId,

        productId:
        review.productId,

        rating:
        review.rating,

        title:
        review.title,

        content:
        review.content,

        status:
        review.status as ReviewDto["status"],

        createdAt:
        review.createdAt,

        updatedAt:
        review.updatedAt,

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

        reply:
        review.reply,
    };
}
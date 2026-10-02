export type ReviewResponseId = string;

export type SellerReviewResponseId =
    ReviewResponseId;

export interface SellerReviewResponseInput {
    readonly reviewId: string;

    readonly sellerId: string;

    readonly content: string;
}

export interface SellerReviewResponseRecord {
    readonly id: ReviewResponseId;

    readonly reviewId: string;

    readonly sellerId: string;

    readonly content: string;

    readonly createdAt: Date;

    readonly updatedAt: Date;
}


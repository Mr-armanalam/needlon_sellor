// ============================================================================
// Needlon
// Reviews Module
// File: modules/reviews/dto/review.dto.ts
// Description: Seller review response DTO
// Phase: 3.1
// ============================================================================

import type {
    ReviewStatus,
} from "@/db/schema/reviews";

export interface ReviewBuyerDto {
    id: string;

    name: string;

    email: string;

    imageUrl: string | null;
}

export interface ReviewProductDto {
    id: string;

    name: string;

    slug: string;
}

export interface ReviewDto {
    id: string;

    sellerId: string;

    buyerId: string;

    productId: string;

    rating: number;

    title: string | null;

    content: string | null;

    status: ReviewStatus;

    createdAt: Date;

    updatedAt: Date;

    buyer: ReviewBuyerDto;

    product: ReviewProductDto;
}

export interface ReviewPaginationDto {
    page: number;

    limit: number;

    total: number;

    totalPages: number;
}

export interface ReviewListDto {
    items: ReviewDto[];

    pagination: ReviewPaginationDto;
}
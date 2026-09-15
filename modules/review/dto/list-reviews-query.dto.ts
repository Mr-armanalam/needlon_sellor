// ============================================================================
// Needlon
// Reviews Module
// File: modules/reviews/dto/list-reviews-query.dto.ts
// Description: Seller review list request query DTO
// Phase: 4.2
// ============================================================================

export interface ListReviewsQueryDto {
    page?: number;

    limit?: number;

    search?: string;

    rating?: number;
}
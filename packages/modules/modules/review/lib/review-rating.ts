// ============================================================================
// Needlon
// Reviews Module
// File: modules/reviews/lib/review-rating.ts
// Description: Review rating presentation helper
// Phase: 5.9
// ============================================================================

export const REVIEW_RATING_MAX =
    5;

export function getReviewRatingStars(
    rating: number,
): boolean[] {
    const normalizedRating =
        Math.min(
            REVIEW_RATING_MAX,
            Math.max(
                0,
                Math.round(rating),
            ),
        );

    return Array.from(
        {
            length:
            REVIEW_RATING_MAX,
        },
        (_, index) =>
            index <
            normalizedRating,
    );
}
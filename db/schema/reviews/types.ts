// ============================================================================
// Needlon
// Reviews Module
// File: db/schema/reviews/types.ts
// Description: Review database types
// Phase: 1.2 - Review Database Foundation
// ============================================================================

import {
    REVIEW_RATING_VALUES,
} from "./constants";

/**
 * ============================================================================
 * Review Rating
 * ============================================================================
 */

export type ReviewRating =
    (typeof REVIEW_RATING_VALUES)[number];

/**
 * ============================================================================
 * Review Rating Constraint
 * ============================================================================
 *
 * Represents the database-supported rating range.
 * The database constraint itself is implemented in table.ts.
 * ============================================================================
 */

export interface ReviewRatingConstraint {
    readonly min: typeof REVIEW_RATING_VALUES[0];

    readonly max: typeof REVIEW_RATING_VALUES[
        typeof REVIEW_RATING_VALUES.length extends infer _T
            ? 4
            : never
        ];
}

/**
 * ============================================================================
 * Review Identifier Types
 * ============================================================================
 *
 * UUID identifiers remain represented as strings at the TypeScript boundary.
 * ============================================================================
 */

export type ReviewId = string;

export type SellerReviewId = ReviewId;

/**
 * ============================================================================
 * Review Status
 * ============================================================================
 *
 * Review status values are intentionally not introduced here because the
 * approved implementation roadmap assigns status definition to step 1.3.
 * ============================================================================
 */
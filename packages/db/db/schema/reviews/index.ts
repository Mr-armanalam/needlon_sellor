// ============================================================================
// Needlon
// Reviews Module
// File: db/schema/reviews/index.ts
// Description: Reviews database schema exports
// Phase: 1.6 - Review Database Foundation
// ============================================================================

export {
    reviewsTable,
} from "./table";

export type {
    ReviewMetadata,
} from "./metadata";

export {
    REVIEW_MIN_RATING,
    REVIEW_MAX_RATING,
    REVIEW_RATING_VALUES,
    REVIEW_TITLE_MAX_LENGTH,
    REVIEW_CONTENT_MAX_LENGTH,
    REVIEW_METADATA_VERSION,
} from "./constants";

export type {
    ReviewRating,
    ReviewRatingConstraint,
    ReviewId,
    SellerReviewId,
} from "./types";

export {
    REVIEW_STATUS_VALUES,
    REVIEW_DEFAULT_STATUS,
} from "./constants";

export type {
    ReviewStatus,
} from "./constants";
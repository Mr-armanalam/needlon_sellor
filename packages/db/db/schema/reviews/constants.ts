// ============================================================================
// Needlon
// Reviews Module
// File: db/schema/reviews/constants.ts
// Description: Review domain constants
// Phase: 1.1 - Review Database Foundation
// ============================================================================

/**
 * ============================================================================
 * Review Rating
 * ============================================================================
 *
 * Reviews use a five-point rating scale.
 *
 * 1 = Lowest rating
 * 5 = Highest rating
 *
 * The rating values are intentionally represented as numeric constants so
 * they can be reused by database constraints, validation, services, and
 * frontend contracts without duplicating business values.
 * ============================================================================
 */

export const REVIEW_MIN_RATING = 1;

export const REVIEW_MAX_RATING = 5;

export const REVIEW_RATING_VALUES = [
    1,
    2,
    3,
    4,
    5,
] as const;

export type ReviewRating =
    (typeof REVIEW_RATING_VALUES)[number];

/**
 * ============================================================================
 * Review Text
 * ============================================================================
 *
 * These limits define the persistence-level boundaries for review content.
 *
 * The exact UI copy and validation behavior should remain in the Reviews
 * module validation layer.
 * ============================================================================
 */

export const REVIEW_TITLE_MAX_LENGTH = 255;

export const REVIEW_CONTENT_MAX_LENGTH = 5000;

/**
 * ============================================================================
 * Review Metadata
 * ============================================================================
 *
 * Metadata is optional and reserved for non-core review information.
 * Business-critical review fields must remain explicit database columns.
 * ============================================================================
 */

export const REVIEW_METADATA_VERSION = 1;

export const REVIEW_MODERATION_STATUS_VALUES = [
    "PUBLISHED",
    "FLAGGED",
] as const;

export type ReviewModerationStatus =
    (typeof REVIEW_MODERATION_STATUS_VALUES)[number];

export const REVIEW_MODERATION_STATUS = {
    PUBLISHED: "PUBLISHED",
    FLAGGED: "FLAGGED",
} as const;

export const REVIEW_STATUS_VALUES = [
    "PUBLISHED",
    "FLAGGED",
    "REMOVED",
] as const;

export type ReviewStatus =
    (typeof REVIEW_STATUS_VALUES)[number];

export const REVIEW_DEFAULT_STATUS =
    "PUBLISHED" satisfies ReviewStatus;
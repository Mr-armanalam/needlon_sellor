// ============================================================================
// Needlon
// Reviews Module
// File: db/schema/reviews/metadata.ts
// Description: Review metadata type
// Phase: 1.3 - Review Database Foundation
// ============================================================================

/**
 * ============================================================================
 * Review Metadata
 * ============================================================================
 *
 * Optional non-core metadata associated with a review.
 *
 * Business-critical review data must remain represented by explicit database
 * columns. Metadata is reserved for additional review information that does
 * not define the review's core business identity.
 * ============================================================================
 */

export interface ReviewMetadata {
    readonly version?: number;

    readonly source?: string;

    readonly [key: string]:
        | string
        | number
        | boolean
        | null
        | undefined;
}
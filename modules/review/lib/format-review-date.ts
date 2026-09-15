// ============================================================================
// Needlon
// Reviews Module
// File: modules/reviews/lib/format-review-date.ts
// Description: Review date presentation helper
// Phase: 5.12
// ============================================================================

export function formatReviewDate(
    value: Date,
): string {
    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        },
    ).format(value);
}
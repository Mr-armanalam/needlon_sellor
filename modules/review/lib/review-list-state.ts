// ============================================================================
// Needlon
// Reviews Module
// File: modules/reviews/lib/review-list-state.ts
// Description: Review list presentation state helpers
// Phase: 5.5 - 5.15
// ============================================================================

export type ReviewListState =
    | "loading"
    | "empty"
    | "error"
    | "ready";

export function getReviewListState({
                                       isLoading,
                                       isError,
                                       itemCount,
                                   }: {
    isLoading: boolean;

    isError: boolean;

    itemCount: number;
}): ReviewListState {
    if (isLoading) {
        return "loading";
    }

    if (isError) {
        return "error";
    }

    if (itemCount === 0) {
        return "empty";
    }

    return "ready";
}
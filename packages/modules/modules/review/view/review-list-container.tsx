// ============================================================================
// Needlon
// Reviews Module
// File: modules/reviews/view/review-list-container.tsx
// Description: Seller review list with filter loading behavior
// Phase: 6.2 - 6.6
// ============================================================================

"use client";

import {
    useSellerReviews,
} from "../hooks/use-seller-reviews";

import {
    toReviewListItem,
} from "../lib/to-review-list-items";

import {
    getReviewListState,
} from "../lib/review-list-state";

import {
    ReviewCard,
} from "./review-card";

interface ReviewListContainerProps {
    search?: string;

    rating?: number;
}

export function ReviewListContainer({
                                        search,
                                        rating,
                                    }: ReviewListContainerProps) {
    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
    } = useSellerReviews({
        page: 1,
        limit: 20,
        search,
        rating,
    });

    const items =
        data?.items?.map(
            toReviewListItem,
        ) ?? [];

    const state =
        getReviewListState({
            isLoading,
            isError,
            itemCount:
            items.length,
        });

    if (state === "loading") {
        return (
            <ReviewListLoadingState />
        );
    }

    if (state === "error") {
        return (
            <ReviewListErrorState
                message={
                    error instanceof Error
                        ? error.message
                        : "Unable to load reviews."
                }
            />
        );
    }

    if (state === "empty") {
        return (
            <ReviewListEmptyState
                hasFilters={
                    Boolean(
                        search ||
                        rating,
                    )
                }
            />
        );
    }

    return (
        <div className="relative flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
            {isFetching && (
                <div
                    aria-live="polite"
                    aria-label="Updating reviews"
                    className="sticky top-0 z-10 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600"
                >
                    Updating reviews...
                </div>
            )}

            {items.map(
                (review) => (
                    <ReviewCard
                        key={
                            review.id
                        }
                        review={
                            review
                        }
                    />
                ),
            )}
        </div>
    );
}

function ReviewListLoadingState() {
    return (
        <div
            aria-busy="true"
            aria-label="Loading reviews"
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden pr-1"
        >
            {Array.from(
                {
                    length: 3,
                },
                (_, index) => (
                    <div
                        key={index}
                        className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gray-100" />

                                <div className="space-y-2">
                                    <div className="h-3 w-32 rounded bg-gray-100" />
                                    <div className="h-2.5 w-24 rounded bg-gray-100" />
                                </div>
                            </div>

                            <div className="h-3 w-24 rounded bg-gray-100" />
                        </div>

                        <div className="mt-5 space-y-3">
                            <div className="h-3 w-40 rounded bg-gray-100" />
                            <div className="h-3 w-full rounded bg-gray-100" />
                            <div className="h-3 w-4/5 rounded bg-gray-100" />
                        </div>
                    </div>
                ),
            )}
        </div>
    );
}

function ReviewListEmptyState({
                                  hasFilters,
                              }: {
    hasFilters: boolean;
}) {
    return (
        <div className="flex min-h-0 flex-1 items-center justify-center rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900">
                    No reviews found
                </p>

                <p className="text-xs text-gray-400">
                    {hasFilters
                        ? "No active customer reviews match your filter parameters."
                        : "There are no active customer reviews yet."}
                </p>
            </div>
        </div>
    );
}

function ReviewListErrorState({
                                  message,
                              }: {
    message: string;
}) {
    return (
        <div
            role="alert"
            className="flex min-h-0 flex-1 items-center justify-center rounded-2xl border border-rose-100 bg-white p-12 text-center shadow-sm"
        >
            <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900">
                    Unable to load reviews
                </p>

                <p className="text-xs text-gray-400">
                    {message}
                </p>
            </div>
        </div>
    );
}
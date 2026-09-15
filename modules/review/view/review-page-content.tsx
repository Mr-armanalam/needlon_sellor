// ============================================================================
// Needlon
// Reviews Module
// File: modules/reviews/view/reviews-page-content.tsx
// Description: Reviews search and rating filter state
// Phase: 6.1 - 6.4
// ============================================================================

"use client";

import {
    Search,
    SlidersHorizontal,
} from "lucide-react";
import {
    useState,
} from "react";

import {
    ReviewListContainer,
} from "./review-list-container";

export function ReviewsPageContent() {
    // ------------------------------------------------------------------------
    // 6.1 Review Search State
    // ------------------------------------------------------------------------

    const [
        search,
        setSearch,
    ] = useState("");

    // ------------------------------------------------------------------------
    // 6.3 Rating Filter State
    // ------------------------------------------------------------------------

    const [
        rating,
        setRating,
    ] = useState<number | undefined>(
        undefined,
    );

    // ------------------------------------------------------------------------
    // 6.2 / 6.4
    // Search and rating state are passed directly to the review list
    // container, which passes them to useSellerReviews().
    // ------------------------------------------------------------------------

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
            <div className="flex flex-shrink-0 items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">
                        Reviews & Moderation
                    </h1>

                    <p className="mt-0.5 text-xs text-gray-400">
                        Manage customer sentiment, product ratings,
                        and feedback lines.
                    </p>
                </div>
            </div>

            <div className="flex flex-shrink-0 flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row">
                <div className="relative w-full flex-1">
                    <Search
                        aria-hidden="true"
                        className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                    />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) => {
                            setSearch(
                                event.target.value,
                            );
                        }}
                        placeholder="Search within text or client names..."
                        aria-label="Search reviews"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>

                <div className="flex w-full items-center gap-2 sm:w-auto">
                    <SlidersHorizontal
                        aria-hidden="true"
                        className="hidden h-4 w-4 text-gray-400 sm:block"
                    />

                    <select
                        value={
                            rating ??
                            ""
                        }
                        onChange={(event) => {
                            const value =
                                event.target.value;

                            setRating(
                                value
                                    ? Number(value)
                                    : undefined,
                            );
                        }}
                        aria-label="Filter reviews by rating"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:w-40"
                    >
                        <option value="">
                            All Stars Rating
                        </option>

                        <option value="5">
                            5 Stars
                        </option>

                        <option value="4">
                            4 Stars
                        </option>

                        <option value="3">
                            3 Stars
                        </option>

                        <option value="2">
                            2 Stars
                        </option>

                        <option value="1">
                            1 Star
                        </option>
                    </select>
                </div>
            </div>

            <ReviewListContainer
                search={
                    search.trim() ||
                    undefined
                }
                rating={
                    rating
                }
            />
        </div>
    );
}
// ============================================================================
// Needlon
// Reviews Module
// File: modules/reviews/view/review-card.tsx
// Description: Individual seller review card
// Phase: 5.6 - 5.12
// ============================================================================

"use client";

import {
    CheckCircle2,
    Star,
} from "lucide-react";

import type {
    ReviewListItem,
} from "../lib/to-review-list-items";

import {
    formatReviewDate,
} from "../lib/format-review-date";

import {
    getReviewRatingStars,
} from "../lib/review-rating";

interface ReviewCardProps {
    review: ReviewListItem;
}

export function ReviewCard({
                               review,
                           }: ReviewCardProps) {
    const stars =
        getReviewRatingStars(
            review.rating,
        );

    return (
        <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4">
                <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                        <BuyerAvatar
                            name={
                                review
                                    .buyer
                                    .name
                            }
                            imageUrl={
                                review
                                    .buyer
                                    .imageUrl
                            }
                        />

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                                <h3 className="truncate text-sm font-semibold text-gray-900">
                                    {
                                        review
                                            .buyer
                                            .name
                                    }
                                </h3>

                                <VerifiedBuyerState
                                    status={
                                        review.status
                                    }
                                />
                            </div>

                            <p className="mt-0.5 text-xs text-gray-400">
                                {
                                    review
                                        .buyer
                                        .email
                                }
                            </p>
                        </div>
                    </div>

                    <time
                        dateTime={
                            review.createdAt.toISOString()
                        }
                        className="flex-shrink-0 text-xs text-gray-400"
                    >
                        {formatReviewDate(
                            review.createdAt,
                        )}
                    </time>
                </header>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div
                        aria-label={`${review.rating} out of 5 stars`}
                        className="flex items-center gap-0.5"
                    >
                        {stars.map(
                            (
                                filled,
                                index,
                            ) => (
                                <Star
                                    key={
                                        index
                                    }
                                    aria-hidden="true"
                                    className={
                                        filled
                                            ? "h-3.5 w-3.5 fill-current text-amber-400"
                                            : "h-3.5 w-3.5 text-gray-200"
                                    }
                                />
                            ),
                        )}
                    </div>

                    <span className="max-w-full truncate rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500">
                        Product:{" "}
                        {
                            review
                                .product
                                .name
                        }
                    </span>
                </div>

                <div className="space-y-1.5">
                    {review.title && (
                        <h4 className="text-sm font-bold text-gray-900">
                            "{review.title}"
                        </h4>
                    )}

                    {review.content && (
                        <p className="text-sm leading-relaxed text-gray-600">
                            {
                                review.content
                            }
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}

function BuyerAvatar({
                         name,
                         imageUrl,
                     }: {
    name: string;
    imageUrl: string | null;
}) {
    const initials =
        name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(
                (part) =>
                    part.charAt(0),
            )
            .join("")
            .toUpperCase() || "?";

    if (!imageUrl) {
        return (
            <div
                aria-hidden="true"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500"
            >
                {initials}
            </div>
        );
    }

    return (
        <img
            src={imageUrl}
            alt=""
            className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
        />
    );
}

function VerifiedBuyerState({
                                status,
                            }: {
    status: ReviewListItem["status"];
}) {
    return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400">
            <CheckCircle2
                aria-hidden="true"
                className="h-3 w-3 text-green-500"
            />
            Verified Buyer
        </span>
    );
}
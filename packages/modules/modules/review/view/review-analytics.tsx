"use client";

import React from "react";

import {
    AlertTriangle,
    ArrowUpRight,
    MessageSquare,
    Star,
} from "lucide-react";

import {
    useReviewMetrics,
} from "../hooks/use-review-metrics";

export default function ReviewAnalytics() {
    const {
        data,
        isLoading,
        isError,
    } =
        useReviewMetrics();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {Array.from(
                    {
                        length: 4,
                    },
                ).map(
                    (_, index) => (
                        <div
                            key={index}
                            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-pulse"
                        >
                            <div className="h-3 w-28 bg-gray-100 rounded" />
                            <div className="h-8 w-20 bg-gray-100 rounded mt-3" />
                            <div className="h-3 w-32 bg-gray-100 rounded mt-3" />
                        </div>
                    ),
                )}
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-xs text-gray-500">
                Unable to load review analytics.
            </div>
        );
    }

    const rating =
        Math.min(
            5,
            Math.max(
                0,
                data.averageRating,
            ),
        );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* 9.10 Average Rating */}

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Average Rating
                    </p>

                    <p className="text-2xl font-bold text-gray-900">
                        {rating.toFixed(
                            1,
                        )}
                        <span className="text-xs font-medium text-gray-400">
                            {" "}
                            / 5.0
                        </span>
                    </p>

                    <div
                        className="flex items-center gap-0.5"
                        aria-label={`${rating.toFixed(
                            1,
                        )} out of 5 stars`}
                    >
                        {Array.from(
                            {
                                length: 5,
                            },
                        ).map(
                            (_, index) => (
                                <Star
                                    key={
                                        index
                                    }
                                    className={`w-3.5 h-3.5 ${
                                        index <
                                        Math.round(
                                            rating,
                                        )
                                            ? "fill-current text-amber-400"
                                            : "text-gray-200"
                                    }`}
                                />
                            ),
                        )}
                    </div>
                </div>

                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <Star className="w-5 h-5" />
                </div>
            </div>

            {/* 9.11 Total Reviews */}

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Total Reviews
                    </p>

                    <p className="text-2xl font-bold text-gray-900">
                        {data.totalReviews.toLocaleString()}
                    </p>

                    <p className="text-xs text-gray-400">
                        Customer feedback
                    </p>
                </div>

                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <MessageSquare className="w-5 h-5" />
                </div>
            </div>

            {/* 9.12 Review Reply Rate */}

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Review Reply Rate
                    </p>

                    <p className="text-2xl font-bold text-gray-900">
                        {data.replyRate.toFixed(
                            0,
                        )}
                        %
                    </p>

                    <p className="text-xs text-gray-400">
                        Target goal: &gt;90%
                    </p>
                </div>

                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <MessageSquare className="w-5 h-5" />
                </div>
            </div>

            {/* 9.13 Flagged / Reports */}

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Flagged/Reports
                    </p>

                    <p className="text-2xl font-bold text-gray-900">
                        {data.pendingReports.toLocaleString()}
                    </p>

                    <p className="text-xs text-gray-400">
                        Requires review moderation
                    </p>
                </div>

                <div
                    className={`p-3 rounded-xl ${
                        data.pendingReports >
                        0
                            ? "bg-rose-50 text-rose-600"
                            : "bg-gray-50 text-gray-400"
                    }`}
                >
                    <AlertTriangle className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}


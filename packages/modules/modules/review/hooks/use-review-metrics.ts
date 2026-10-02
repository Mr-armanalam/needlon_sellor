"use client";

import {
    useQuery,
} from "@tanstack/react-query";

import {
    getReviewMetricsApi,
} from "../api/get-review-metrics";

import {
    reviewsKeys,
} from "../keys";

export function useReviewMetrics() {
    return useQuery({
        queryKey:
            reviewsKeys.metrics(),

        queryFn:
        getReviewMetricsApi,
    });
}

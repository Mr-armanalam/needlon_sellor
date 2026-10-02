"use client";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    reportReview,
} from "../api/report-review";

import {
    reviewsKeys,
} from "../keys";

import type {
    ReportReviewInput,
} from "../schema/report-review-schema";

export function useReportReview() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn:
            (
                input: ReportReviewInput,
            ) =>
                reportReview(
                    input,
                ),

        onSuccess:
            async (
                _data,
                variables,
            ) => {
                await queryClient.invalidateQueries({
                    queryKey:
                        reviewsKeys.lists(),
                });

                await queryClient.invalidateQueries({
                    queryKey:
                        reviewsKeys.detail(
                            variables.reviewId,
                        ),
                });
            },
    });
}

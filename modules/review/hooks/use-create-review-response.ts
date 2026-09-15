"use client";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createReviewResponse,
} from "../api/create-review-response";

import {
    reviewsKeys,
} from "../keys";

import type {
    CreateReviewResponseRequest,
} from "../api/create-review-response";

export function useCreateReviewResponse() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn:
            (
                input: CreateReviewResponseRequest,
            ) =>
                createReviewResponse(
                    input,
                ),

        onSuccess:
            async (
                _response,
                variables,
            ) => {
                await queryClient.invalidateQueries(
                    {
                        queryKey:
                            reviewsKeys.lists(),
                    },
                );

                await queryClient.invalidateQueries(
                    {
                        queryKey:
                            reviewsKeys.detail(
                                variables.reviewId,
                            ),
                    },
                );
            },
    });
}

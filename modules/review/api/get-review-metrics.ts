import {
    apiClient,
} from "@/modules/shared/api/api-client";

import type {
    ReviewMetricsDto,
} from "../dto/review-metrics.dto";

export async function getReviewMetricsApi(): Promise<ReviewMetricsDto> {
    return apiClient.get<ReviewMetricsDto>(
        "/api/seller/reviews/metrics",
    );
}

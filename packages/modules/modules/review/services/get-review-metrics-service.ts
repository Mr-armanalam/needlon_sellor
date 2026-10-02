import {
    getReviewMetrics,
} from "../repository/queries/get-review-metrics";

import type {
    ReviewMetricsDto,
} from "../dto/review-metrics.dto";

interface GetReviewMetricsServiceParams {
    sellerId: string;
}

export async function getReviewMetricsService({
                                                  sellerId,
                                              }: GetReviewMetricsServiceParams): Promise<ReviewMetricsDto> {
    return getReviewMetrics({
        sellerId,
    });
}

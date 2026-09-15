// ============================================================================
// Needlon
// Reviews Module
// File: modules/reviews/keys.ts
// Description: Reviews query keys
// Phase: 6.5
// ============================================================================

export const reviewsKeys = {
    all: [
        "reviews",
    ] as const,

    lists: () => [
        ...reviewsKeys.all,
        "list",
    ] as const,

    list: (
        params: {
            page?: number;
            limit?: number;
            search?: string;
            rating?: number;
        },
    ) => [
        ...reviewsKeys.lists(),
        {
            page:
            params.page,

            limit:
            params.limit,

            search:
            params.search,

            rating:
            params.rating,
        },
    ] as const,

    detail: (
        id: string,
    ) => [
        ...reviewsKeys.all,
        "detail",
        id,
    ] as const,

    metrics:
        () =>
            [
                "reviews",
                "metrics",
            ] as const,
} as const;


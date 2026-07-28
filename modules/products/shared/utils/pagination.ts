export interface PaginationOptions {
    page?: number;
    limit?: number;
}

export interface PaginationResult {
    page: number;
    limit: number;
    offset: number;
}

export function createPagination(
    options: PaginationOptions = {},
): PaginationResult {

    const page =
        Math.max(1, options.page ?? 1);

    const limit =
        Math.min(
            Math.max(1, options.limit ?? 20),
            100,
        );

    return {
        page,
        limit,
        offset: (page - 1) * limit,
    };
}
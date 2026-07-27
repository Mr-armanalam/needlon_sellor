import { PaginationOptions } from "./repository.types";

export function getPagination(
    options?: PaginationOptions,
) {
    const page = Math.max(options?.page ?? 1, 1);

    const limit = Math.min(
        Math.max(options?.limit ?? 20, 1),
        100,
    );

    return {
        page,
        limit,
        offset: (page - 1) * limit,
    };
}
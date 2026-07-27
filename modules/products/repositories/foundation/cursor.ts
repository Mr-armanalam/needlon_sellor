import { CursorPaginationOptions } from "./repository.types";

export function getCursorPagination(
    options?: CursorPaginationOptions,
) {
    return {
        cursor: options?.cursor ?? null,

        limit: Math.min(
            Math.max(options?.limit ?? 20, 1),
            100,
        ),
    };
}
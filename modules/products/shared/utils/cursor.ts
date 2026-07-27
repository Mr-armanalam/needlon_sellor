export interface CursorPagination {
    cursor?: string;
    take?: number;
}

export function normalizeCursor(
    options: CursorPagination,
) {
    return {
        cursor: options.cursor,
        take: Math.min(
            options.take ?? 20,
            100,
        ),
    };
}
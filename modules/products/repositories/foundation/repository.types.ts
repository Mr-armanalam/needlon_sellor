export interface PaginationOptions {
    page?: number;
    limit?: number;
}

export interface CursorPaginationOptions {
    cursor?: string;
    limit?: number;
}

export interface SortOption<
    TField extends string = string,
> {
    field: TField;

    direction?: "asc" | "desc";
}

export interface RepositoryResult<T> {
    data: T;

    total?: number;

    nextCursor?: string | null;
}
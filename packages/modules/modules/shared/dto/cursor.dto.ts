export interface CursorPaginationRequestDto {
    cursor?: string;
    limit?: number;
}

export interface CursorPaginationMetaDto {
    nextCursor: string | null;
    previousCursor: string | null;
    hasNextPage: boolean;
}

export interface CursorPaginatedResponseDto<T> {
    items: T[];
    cursor: CursorPaginationMetaDto;
}
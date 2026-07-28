export interface PaginationRequestDto {
    page?: number;
    limit?: number;
}

export interface PaginationMetaDto {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface PaginatedResponseDto<T> {
    items: T[];
    pagination: PaginationMetaDto;
}
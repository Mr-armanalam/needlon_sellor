export interface ProductSearchDto {
    query?: string;

    categoryId?: string;

    status?: string;

    visibility?: string;

    productType?: string;

    page?: number;

    pageSize?: number;

    cursor?: string;
}
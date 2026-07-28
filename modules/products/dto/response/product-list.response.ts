

import type { ProductListItemDto } from "./product-list-item.response";

export interface ProductListDto {
    items: ProductListItemDto[];

    total: number;

    page: number;

    pageSize: number;

    hasNextPage: boolean;

    nextCursor?: string;
}
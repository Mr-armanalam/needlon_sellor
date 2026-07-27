export interface ProductFilterRequest {
    categoryId?: string;

    brandId?: string;

    status?: string;

    hasVariants?: boolean;

    minPrice?: number;

    maxPrice?: number;
}
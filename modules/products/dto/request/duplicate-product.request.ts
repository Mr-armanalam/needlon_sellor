export interface DuplicateProductRequest {
    productId: string;

    includeImages?: boolean;

    includeVariants?: boolean;
}
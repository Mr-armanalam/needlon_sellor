export interface ProductListItemDto {
    id: string;

    name: string;

    slug: string;

    sku: string | null;

    brand: string | null;

    status: string;

    visibility: string;

    isAvailable: boolean;

    isFeatured: boolean;

    updatedAt: Date;
}
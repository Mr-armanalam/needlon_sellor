import {ProductMetadata} from "@/db/schema/catalog/products";

export interface ProductDto {
    id: string;

    storeId: string;

    categoryId: string;

    name: string;

    slug: string;

    sku: string | null;

    brand: string | null;

    model: string | null;

    hsnCode: string | null;

    countryOfOrigin: string | null;

    shortDescription: string | null;

    description: string | null;

    warranty: string | null;

    productType: string;

    visibility: string;

    status: string;

    isFeatured: boolean;

    isAvailable: boolean;

    sortOrder: number;

    metadata: ProductMetadata;

    publishedAt: Date | null;

    archivedAt: Date | null;

    createdBy: string | null;

    updatedBy: string | null;

    createdAt: Date;

    updatedAt: Date;

    deletedAt: Date | null;
}
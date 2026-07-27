import {productStatusEnum, productTypeEnum, productVisibilityEnum} from "@/db/schema/catalog/enums";

export interface CreateProductDto {
    storeId: string;

    categoryId: string;

    name: string;

    slug: string;

    sku: string;

    brand?: string;

    model?: string;

    hsnCode?: string;

    countryOfOrigin?: string;

    shortDescription?: string;

    description?: string;

    warranty?: string;

    productType: typeof productTypeEnum.enumValues[number];

    visibility: typeof productVisibilityEnum.enumValues[number];

    status?: typeof productStatusEnum.enumValues[number];

    metadata?: Record<string, unknown>;

    sortOrder?: number;

    isFeatured?: boolean;

    isAvailable?: boolean;
    createdBy?: string;
    updatedBy?: string;
}
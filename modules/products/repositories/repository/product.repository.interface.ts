import {
    CreateProductDto,
    UpdateProductDto,
} from "../../dto";

import {NewProduct, Product} from "@/db/schema/catalog/products";
import {CreateDraftRequest} from "@/modules/products/dto/draft/create-draft.request";
import {UpdateDraftRequest} from "@/modules/products/dto/draft/update-draft.request";

export interface ProductListOptions {
    sellerId: string;

    limit: number;

    cursor?: string;

    search?: string;

    status?: string;
    storeId: string;
}

export interface ProductListResult {
    items: Product[];

    nextCursor: string | null;
}

export interface ProductRepository {
    create(
        data: CreateProductDto,
    ): Promise<Product>;

    update(
        id: string,
        data: UpdateProductDto,
    ): Promise<Product>;

    createDraft(
        data: NewProduct,
    ): Promise<Product>;

    createDraft(
        input: CreateDraftRequest,
    ): Promise<Product>;

    updateDraft(
        id: string,
        input: UpdateDraftRequest,
    ): Promise<Product>;

    findDraftById(
        id: string,
    ): Promise<Product | null>;

    deleteDraft(
        id: string,
    ): Promise<void>;

    delete(
        id: string,
    ): Promise<void>;

    findById(
        id: string,
    ): Promise<Product | null>;

    list(
        options: ProductListOptions,
    ): Promise<ProductListResult>;
}
import type {
    Product,
} from "@/db/schema/catalog/products";

import type {
    ProductDto,
    ProductListItemDto,
} from "../dto";

import {
    ProductTransformer,
    ProductListTransformer,
} from "../transformers";

export class ProductResponseMapper {
    static toDto(
        product: Product,
    ): ProductDto {
        return ProductTransformer.toDto(product);
    }

    static toListDto(
        product: Product,
    ): ProductListItemDto {
        return ProductListTransformer.toDto(product);
    }

    static toDtos(
        products: Product[],
    ): ProductDto[] {
        return ProductTransformer.toDtos(products);
    }

    static toListDtos(
        products: Product[],
    ): ProductListItemDto[] {
        return ProductListTransformer.toDtos(products);
    }
}
import type {
    ProductListItemDto,
} from "../dto";

import {productsTable} from "@/db/schema/catalog/products";
import {InferSelectModel} from "drizzle-orm";

export class ProductListTransformer {
    static toDto(
        product: InferSelectModel<typeof productsTable>,
    ): ProductListItemDto {
        return {
            id: product.id,

            name: product.name,

            slug: product.slug,

            sku: null,

            brand: null,

            status: product.status,

            visibility:
            product.visibility,

            isAvailable:
            product.status === "PUBLISHED",

            isFeatured:
            product.isFeatured ?? false,

            updatedAt:
            product.updatedAt,
        };
    }

    static toDtos(
        products: InferSelectModel<typeof productsTable>[],
    ) {
        return products.map(
            this.toDto,
        );
    }
}
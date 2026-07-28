import type {
    Product,
} from "@/db/schema/catalog/products";

import type {
    UpdateProductDto,
} from "../dto";

export class ProductUpdateMapper {
    static merge(
        product: Product,
        dto: UpdateProductDto,
    ): Product {
        return {
            ...product,

            ...dto,

            updatedAt: new Date(),
        };
    }
}
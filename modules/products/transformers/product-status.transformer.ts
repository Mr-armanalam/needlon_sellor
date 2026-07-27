import type {
    ProductStatusDto,
} from "../dto";
import {Product, productsTable} from "@/db/schema/catalog/products";
import {InferSelectModel} from "drizzle-orm";


export class ProductStatusTransformer {
    static toDto(
        product: InferSelectModel<typeof productsTable>,
    ): ProductStatusDto {
        return {
            id: product.id,

            status: product.status,

            visibility:
            product.visibility,

            isAvailable:
            product.status === "PUBLISHED",

            publishedAt:
            product.publishedAt,

            archivedAt:
            null,
        };
    }
}
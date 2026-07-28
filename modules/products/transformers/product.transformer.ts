import type {
    ProductDto,
} from "../dto";

import type {
    productsTable,
} from "@/db/schema/catalog/products/table";
import type {InferSelectModel} from "drizzle-orm";

export class ProductTransformer {
    static toDto(
        product: InferSelectModel<typeof productsTable>,
    ): ProductDto {
        return {
            id: product.id,

            storeId: product.storeId || "",

            categoryId: product.categoryId,

            name: product.name,

            slug: product.slug,

            sku: null,

            brand: null,

            model: null,

            hsnCode: null,

            countryOfOrigin: null,

            shortDescription:
            product.shortDescription || null,

            description:
            product.description || null,

            warranty: null,

            productType:
            product.productType || "PHYSICAL",

            visibility:
            product.visibility || "PRIVATE",

            status:
            product.status || "DRAFT",

            isFeatured:
            product.isFeatured ?? false,

            isAvailable:
            product.status === "PUBLISHED",

            sortOrder: 0,

            metadata: {} as any,

            publishedAt:
            product.publishedAt,

            archivedAt: null,

            createdBy: null,

            updatedBy: null,

            createdAt:
            product.createdAt,

            updatedAt:
            product.updatedAt,

            deletedAt:
            product.deletedAt,
        };
    }

    static toDtos(
        products: InferSelectModel<typeof productsTable>[],
    ): ProductDto[] {
        return products.map(
            this.toDto,
        );
    }
}
import type {
    Product,
} from "@/db/schema/catalog/products";

export class ProductPublishMapper {
    static publish(
        product: Product,
    ): Product {
        return {
            ...product,
            status: "PUBLISHED",
            publishedAt: new Date(),
            updatedAt: new Date(),
        };
    }

    static archive(
        product: Product,
    ): Product {
        return {
            ...product,
            status: "ARCHIVED",
            deletedAt: new Date(),
            updatedAt: new Date(),
        };
    }

    static unpublish(
        product: Product,
    ): Product {
        return {
            ...product,
            status: "DRAFT",
            publishedAt: null,
            updatedAt: new Date(),
        };
    }
}
import { Category } from "@/db/schema/catalog/categories";

export interface CategoryListOptions {
    parentId?: string | null;

    includeInactive?: boolean;
}

export interface CategoryRepository {
    findById(
        id: string,
    ): Promise<Category | null>;

    findBySlug(
        slug: string,
    ): Promise<Category | null>;

    findRoot(): Promise<Category[]>;

    findChildren(
        parentId: string,
    ): Promise<Category[]>;

    list(
        options?: CategoryListOptions,
    ): Promise<Category[]>;

    exists(
        id: string,
    ): Promise<boolean>;
}
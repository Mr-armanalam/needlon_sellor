import {
    and,
    eq,
    isNull,
} from "drizzle-orm";

import { db } from "@/db";

import {
    categoriesTable,
    Category,
} from "@/db/schema/catalog/categories";

import {
    CategoryRepository,
    CategoryListOptions,
} from "./category.repository.interface";

export class DrizzleCategoryRepository
    implements CategoryRepository
{
    async findById(
        id: string,
    ): Promise<Category | null> {
        const [category] = await db
            .select()
            .from(categoriesTable)
            .where(eq(categoriesTable.id, id))
            .limit(1);

        return category ?? null;
    }

    async findBySlug(
        slug: string,
    ): Promise<Category | null> {
        const [category] = await db
            .select()
            .from(categoriesTable)
            .where(eq(categoriesTable.slug, slug))
            .limit(1);

        return category ?? null;
    }

    async findRoot(): Promise<Category[]> {
        return db
            .select()
            .from(categoriesTable)
            .where(isNull(categoriesTable.parentId));
    }

    async findChildren(
        parentId: string,
    ): Promise<Category[]> {
        return db
            .select()
            .from(categoriesTable)
            .where(
                eq(
                    categoriesTable.parentId,
                    parentId,
                ),
            );
    }

    async list(
        options?: CategoryListOptions,
    ): Promise<Category[]> {
        const conditions = [];

        if (options?.parentId !== undefined) {
            if (options.parentId === null) {
                conditions.push(
                    isNull(
                        categoriesTable.parentId,
                    ),
                );
            } else {
                conditions.push(
                    eq(
                        categoriesTable.parentId,
                        options.parentId,
                    ),
                );
            }
        }

        if (!options?.includeInactive) {
            conditions.push(
                eq(
                    categoriesTable.status,
                    "ACTIVE",
                ),
            );
        }

        if (conditions.length === 0) {
            return db
                .select()
                .from(categoriesTable);
        }

        return db
            .select()
            .from(categoriesTable)
            .where(and(...conditions));
    }

    async exists(
        id: string,
    ): Promise<boolean> {
        const category =
            await this.findById(id);

        return category !== null;
    }
}
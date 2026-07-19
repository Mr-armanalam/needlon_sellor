import {
    and,
    eq,
    isNull,
} from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema/catalog/category/category";

interface UpdateCategoryParams {
    id: string;

    data: Partial<
        typeof categories.$inferInsert
    >;
}

export async function updateCategory({
                                         id,
                                         data,
                                     }: UpdateCategoryParams) {
    const [category] =
        await db
            .update(categories)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(categories.id, id),
                    isNull(
                        categories.deletedAt,
                    ),
                ),
            )
            .returning();

    return category;
}
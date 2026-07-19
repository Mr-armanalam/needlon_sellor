import {
    and,
    eq,
    isNull,
} from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema/catalog/category/category";

export async function deleteCategory(
    id: string,
) {
    const [category] =
        await db
            .update(categories)
            .set({
                deletedAt: new Date(),
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
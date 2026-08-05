import {
    and,
    eq,
    isNull,
} from "drizzle-orm";

import { db } from "@/db";
import { categoriesTable as categories } from "@/db/schema/catalog/categories/table";

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
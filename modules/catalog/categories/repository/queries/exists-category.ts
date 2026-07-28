import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema/catalog/categories";

export async function existsCategory(
    categoryId: string,
): Promise<boolean> {
    const category =
        await db.query.categories.findFirst({
            columns: {
                id: true,
            },

            where: and(
                eq(categories.id, categoryId),
                isNull(categories.deletedAt),
            ),
        });

    return !!category;
}
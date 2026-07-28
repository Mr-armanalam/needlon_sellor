import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema/catalog/categories";

export async function restoreCategory(
    categoryId: string,
) {

    const [category] = await db
        .update(categories)
        .set({
            deletedAt: null,
            updatedAt: new Date(),
        })
        .where(eq(categories.id, categoryId))
        .returning();

    return category;

}
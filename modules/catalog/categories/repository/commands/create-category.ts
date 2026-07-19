import { db } from "@/db";
import { categories } from "@/db/schema/catalog/category/category";

type CreateCategoryData =
    typeof categories.$inferInsert;

export async function createCategory(
    data: CreateCategoryData,
) {
    const [category] =
        await db
            .insert(categories)
            .values(data)
            .returning();

    return category;
}
import {
    and,
    eq,
    isNull,
} from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema/catalog/category/category";

export async function findCategoryById(
    id: string,
) {
    return db.query.categories.findFirst({
        where: and(
            eq(categories.id, id),
            isNull(categories.deletedAt),
        ),
    });
}
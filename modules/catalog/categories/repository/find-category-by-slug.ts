import {
    and,
    eq,
    isNull,
} from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema/catalog/category/category";

export async function findCategoryBySlug(
    slug: string,
) {
    return db.query.categories.findFirst({
        where: and(
            eq(categories.slug, slug),
            isNull(categories.deletedAt),
        ),
    });
}
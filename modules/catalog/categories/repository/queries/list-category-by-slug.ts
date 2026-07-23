import {
    and,
    eq,
    isNull,
} from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema/catalog/categories/table";

export async function listCategoryBySlug(
    slug: string,
) {
    return db.query.categories.findFirst({
        where: and(
            eq(categories.slug, slug),
            isNull(categories.deletedAt),
        ),
    });
}
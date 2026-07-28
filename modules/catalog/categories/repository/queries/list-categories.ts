import {
    asc,
    eq,
    isNull,
} from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema/catalog/categories/table";

export async function listCategories() {
    return db.query.categories.findMany({
        where: isNull(
            categories.deletedAt,
        ),

        orderBy: [
            asc(categories.sortOrder),
            asc(categories.name),
        ],
    });
}
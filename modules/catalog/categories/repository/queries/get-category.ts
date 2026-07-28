import {
    and,
    eq,
    isNull,
} from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema/catalog/categories";

export async function getCategory(
    categoryId: string,
) {
    return db.query.categories.findFirst({

        where: and(
            eq(categories.id, categoryId),
            isNull(categories.deletedAt),
        ),

        with: {

            parent: true,

            children: {
                where: isNull(
                    categories.deletedAt,
                ),
            },
        },
    });
}
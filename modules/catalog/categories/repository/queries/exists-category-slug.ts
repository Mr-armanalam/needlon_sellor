import {
    and,
    eq,
    isNull,
    ne,
} from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema/catalog/categories";

interface ExistsCategorySlugParams {
    slug: string;
    excludeCategoryId?: string;
}

export async function existsCategorySlug({
                                             slug,
                                             excludeCategoryId,
                                         }: ExistsCategorySlugParams): Promise<boolean> {

    const conditions = [
        eq(categories.slug, slug),
        isNull(categories.deletedAt),
    ];

    if (excludeCategoryId) {
        conditions.push(
            ne(
                categories.id,
                excludeCategoryId,
            ),
        );
    }

    const category =
        await db.query.categories.findFirst({
            columns: {
                id: true,
            },

            where: and(...conditions),
        });

    return !!category;
}
import { NotFoundError } from "@/modules/shared/errors/not-found-error";

import { getCategory } from "../repository/queries/get-category";
// ⚠️ ASSUMPTION: exact export name from list-category-by-slug.ts.
// Guessing it exports a single-result finder named listCategoryBySlug
// matching the filename convention. Verify and rename the import if
// the real export is e.g. `getCategoryBySlug`.
import { listCategoryBySlug } from "../repository/queries/list-category-by-slug";

export async function getCategoryByIdService(
    categoryId: string,
) {

    const category = await getCategory(categoryId);

    if (!category) {
        throw new NotFoundError("Category not found.");
    }

    return category;

}

export async function getCategoryBySlugService(
    slug: string,
) {

    const category = await listCategoryBySlug(slug);

    if (!category) {
        throw new NotFoundError("Category not found.");
    }

    return category;

}
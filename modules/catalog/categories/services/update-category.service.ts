import { NotFoundError } from "@/modules/shared/errors/not-found-error";

import { getCategory } from "../repository/queries/get-category";
// ⚠️ ASSUMPTION: existsCategorySlug needs a second "exclude this id"
// param during updates, so renaming a category to a slug it already
// owns doesn't false-positive as a conflict. Verify the real signature.
import { existsCategorySlug } from "../repository/queries/exists-category-slug";
import { updateCategory } from "../repository/commands/update-category";
import { generateUniqueSlug } from "@/modules/shared/slug/generate-unique-slug";

interface UpdateCategoryServiceInput {
    name?: string;
    displayName?: string;
    description?: string;
    coverImagePath?: string;
    coverImageUrl?: string;
    code?: string;
    isFeatured?: boolean;
    isVisible?: boolean;
    status?: string;
    // ⚠️ Left as string pending shared/validations/catalog-status.ts —
    // should be the real CatalogStatus union once shared.
    sortOrder?: number;
    metadata?: unknown;
    updatedBy: string;
}

export async function updateCategoryService(
    categoryId: string,
    input: UpdateCategoryServiceInput,
) {

    const existing = await getCategory(categoryId);

    if (!existing) {
        throw new NotFoundError("Category not found.");
    }

    let slug = existing.slug;

    if (input.name && input.name !== existing.name) {
        slug = await generateUniqueSlug(
            input.name,
            (candidate) =>
                existsCategorySlug(candidate, categoryId),
        );
    }

    return updateCategory(categoryId, {
        ...input,
        slug,
        updatedAt: new Date(),
    });

}
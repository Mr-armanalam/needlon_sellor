import { NotFoundError } from "@/modules/shared/errors/not-found-error";
import { ConflictError } from "@/modules/shared/errors/conflict-error";

import { getCategoryIncludingDeleted } from "../repository/queries/get-category-including-deleted";
import { restoreCategory } from "../repository/commands/restore-category";

export async function restoreCategoryService(
    categoryId: string,
) {

    const category = await getCategoryIncludingDeleted(categoryId);

    if (!category) {
        throw new NotFoundError("Category not found.");
    }

    if (!category.deletedAt) {
        throw new ConflictError("Category is not deleted.");
    }

    return restoreCategory(categoryId);

}
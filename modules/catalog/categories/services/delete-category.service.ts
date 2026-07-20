import { NotFoundError } from "@/modules/shared/errors/not-found-error";
import { ConflictError } from "@/modules/shared/errors/conflict-error";

import { getCategory } from "../repository/queries/get-category";
// ⚠️ ASSUMPTION: deleteCategory command signature, mirroring the
// create/restore convention: deleteCategory(id: string) -> soft delete
// (sets deletedAt = now()). Verify against the real file.
import { deleteCategory } from "../repository/commands/delete-category";
import { updateCategory } from "../repository/commands/update-category";

export async function deleteCategoryService(
    categoryId: string,
) {

    const category = await getCategory(categoryId);

    if (!category) {
        throw new NotFoundError("Category not found.");
    }

    // ⚠️ BUSINESS RULE ASSUMPTION (flagged earlier, not yet confirmed):
    // blocking delete when active subcategories exist, rather than
    // cascading the soft delete. Swap this for a cascade if that's
    // the intended behaviour instead.
    if (category.children && category.children.length > 0) {
        throw new ConflictError(
            "Cannot delete a category that has active subcategories. Move or delete them first.",
        );
    }

    const deleted = await deleteCategory(categoryId);

    // If this was the last active child, the parent becomes a leaf again.
    if (category.parentId) {
        const parent = await getCategory(category.parentId);
        if (parent && parent.children.length === 0) {
            await updateCategory(parent.id, { isLeaf: true });
        }
    }

    return deleted;

}
import { NotFoundError } from "@/modules/shared/errors/not-found-error";
import { ValidationError } from "@/modules/shared/errors/validation-error";

import { getCategory } from "../repository/queries/get-category";
import { moveCategory } from "../repository/commands/move-category";
import { updateCategory } from "../repository/commands/update-category";
import {
    computeCategoryHierarchy,
    getDescendantPathPrefix,
} from "../lib/compute-category-path";

export async function moveCategoryService(
    categoryId: string,
    newParentId: string | null,
) {

    const category = await getCategory(categoryId);

    if (!category) {
        throw new NotFoundError("Category not found.");
    }

    if (newParentId === categoryId) {
        throw new ValidationError(
            "A category cannot be moved under itself.",
        );
    }

    const newParent = newParentId
        ? await getCategory(newParentId)
        : null;

    if (newParentId && !newParent) {
        throw new NotFoundError("Target parent category not found.");
    }

    if (newParent) {
        const ownSubtreePrefix = getDescendantPathPrefix(category);
        const isMovingIntoOwnDescendant =
            newParent.path.startsWith(ownSubtreePrefix);

        if (isMovingIntoOwnDescendant) {
            throw new ValidationError(
                "Cannot move a category under one of its own descendants.",
            );
        }
    }

    const { path: newPath, level: newLevel } =
        computeCategoryHierarchy(newParent);

    const oldParentId = category.parentId;

    const moved = await moveCategory({
        categoryId,
        oldPath: category.path,
        oldLevel: category.level,
        newParentId,
        newPath,
        newLevel,
    });

    if (newParent && newParent.isLeaf !== false) {
        await updateCategory(newParent.id, { isLeaf: false });
    }

    if (oldParentId && oldParentId !== newParentId) {
        const oldParent = await getCategory(oldParentId);
        if (oldParent && oldParent.children.length === 0) {
            await updateCategory(oldParentId, { isLeaf: true });
        }
    }

    return moved;

}
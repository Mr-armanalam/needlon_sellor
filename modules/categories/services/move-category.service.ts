import { moveCategory } from "../repository/commands/move-category";
import { findCategoryById } from "../repository/queries/find-categories";

export interface MoveCategoryServiceInput {
  categoryId: string;
  newParentId: string | null;
}

export async function moveCategoryService({ categoryId, newParentId }: MoveCategoryServiceInput) {
  const category = await findCategoryById(categoryId);
  if (!category) {
    throw new Error(`Category with ID "${categoryId}" not found.`);
  }

  if (categoryId === newParentId) {
    throw new Error("A category cannot be its own parent.");
  }

  let newLevel = 0;

  if (newParentId) {
    const newParent = await findCategoryById(newParentId);
    if (!newParent) {
      throw new Error(`New parent category with ID "${newParentId}" not found.`);
    }
    newLevel = newParent.level + 1;
  }

  const moved = await moveCategory({
    categoryId,
    newParentId,
    newLevel,
  });

  return moved;
}

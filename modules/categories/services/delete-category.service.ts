import { deleteCategory } from "../repository/commands/delete-category";
import { findCategoryById } from "../repository/queries/find-categories";

export async function deleteCategoryService(categoryId: string) {
  const existing = await findCategoryById(categoryId);
  if (!existing) {
    throw new Error(`Category with ID "${categoryId}" not found.`);
  }

  const deleted = await deleteCategory(categoryId);
  return deleted;
}

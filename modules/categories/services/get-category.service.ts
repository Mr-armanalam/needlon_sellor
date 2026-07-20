import { findCategoryById } from "../repository/queries/find-categories";

export async function getCategoryService(id: string) {
  if (!id) {
    throw new Error("Category ID is required.");
  }

  const category = await findCategoryById(id);
  if (!category) {
    throw new Error(`Category with ID "${id}" not found.`);
  }

  return category;
}

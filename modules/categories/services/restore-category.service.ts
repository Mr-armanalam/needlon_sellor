import { restoreCategory } from "../repository/commands/restore-category";

export async function restoreCategoryService(categoryId: string) {
  const restored = await restoreCategory(categoryId);
  return restored;
}

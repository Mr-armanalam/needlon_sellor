import { findCategories } from "../repository/queries/find-categories";
import { buildCategoryTree } from "../mapper";

export async function getCategoriesService() {
  const categories = await findCategories();
  const tree = buildCategoryTree(categories);

  return {
    raw: categories,
    tree,
  };
}

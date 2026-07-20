import { generateUniqueSlug } from "@/modules/shared/slug/generate-unique-slug";
import { createCategory } from "../repository/commands/create-category";
import { findCategoryById, findCategoryBySlug } from "../repository/queries/find-categories";

export interface CreateCategoryInput {
  name: string;
  parentId?: string | null;
  description?: string | null;
  iconUrl?: string | null;
  bannerUrl?: string | null;
  displayOrder?: number;
}

export async function createCategoryService(input: CreateCategoryInput) {
  if (!input.name || !input.name.trim()) {
    throw new Error("Category name is required.");
  }

  let parentLevel = -1;
  let parentPath = "";

  if (input.parentId) {
    const parent = await findCategoryById(input.parentId);
    if (!parent) {
      throw new Error(`Parent category with ID "${input.parentId}" not found.`);
    }
    parentLevel = parent.level;
    parentPath = parent.parentId ? `${parent.parentId}/` : `${parent.id}/`;
  }

  const slug = await generateUniqueSlug(input.name, async (candidate) => {
    const existing = await findCategoryBySlug(candidate);
    return Boolean(existing);
  });

  const level = parentLevel + 1;

  const category = await createCategory({
    name: input.name.trim(),
    slug,
    description: input.description,
    parentId: input.parentId ?? null,
    level,
  });

  return category;
}

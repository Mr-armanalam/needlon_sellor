import { generateUniqueSlug } from "@/modules/shared/slug/generate-unique-slug";
import { updateCategory } from "../repository/commands/update-category";
import { findCategoryById, findCategoryBySlug } from "../repository/queries/find-categories";

export interface UpdateCategoryServiceInput {
  id: string;
  name?: string;
  parentId?: string | null;
  description?: string | null;
  iconUrl?: string | null;
  bannerUrl?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export async function updateCategoryService(input: UpdateCategoryServiceInput) {
  const existing = await findCategoryById(input.id);
  if (!existing) {
    throw new Error(`Category with ID "${input.id}" not found.`);
  }

  let slug = existing.slug;
  if (input.name && input.name.trim() !== existing.name) {
    slug = await generateUniqueSlug(input.name, async (candidate) => {
      if (candidate === existing.slug) return false;
      const found = await findCategoryBySlug(candidate);
      return Boolean(found);
    });
  }

  const updated = await updateCategory({
    id: input.id,
    data: {
      name: input.name ? input.name.trim() : existing.name,
      slug,
      description: input.description ?? existing.description,
      parentId: input.parentId !== undefined ? input.parentId : existing.parentId,
    },
  });

  return updated;
}

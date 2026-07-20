import { generateUniqueSlug } from "@/modules/shared/slug/generate-unique-slug";
import { updateProduct } from "../repository/commands/update-product";
import { getProduct } from "../repository/queries/get-product";
import { existsProductSlug } from "../repository/queries/exists-product-slug";

export interface UpdateProductInput {
  id: string;
  name?: string;
  shortDescription?: string;
  description?: string;
  categoryId?: string;
  brandId?: string | null;
  productType?: "PHYSICAL" | "DIGITAL" | "SERVICE";
  status?: "DRAFT" | "INCOMPLETE" | "PUBLISHED" | "ARCHIVED";
  visibility?: "PUBLIC" | "HIDDEN" | "PRIVATE";
  isFeatured?: boolean;
}

export async function updateProductService(input: UpdateProductInput) {
  const existing = await getProduct(input.id);
  if (!existing) {
    throw new Error(`Product with ID "${input.id}" not found.`);
  }

  let slug = existing.slug;
  if (input.name && input.name.trim() !== existing.name) {
    slug = await generateUniqueSlug(input.name, async (candidate) => {
      if (candidate === existing.slug) return false;
      return existsProductSlug(candidate);
    });
  }

  const publishedAt =
    input.status === "PUBLISHED" && !existing.publishedAt
      ? new Date()
      : existing.publishedAt;

  const updated = await updateProduct(input.id, {
    name: input.name ? input.name.trim() : existing.name,
    slug,
    shortDescription: input.shortDescription ?? existing.shortDescription,
    description: input.description ?? existing.description,
    categoryId: input.categoryId ?? existing.categoryId,
    brandId: input.brandId !== undefined ? input.brandId : existing.brandId,
    productType: input.productType ?? existing.productType,
    status: input.status ?? existing.status,
    visibility: input.visibility ?? existing.visibility,
    isFeatured: input.isFeatured ?? existing.isFeatured,
    publishedAt,
  });

  return updated;
}

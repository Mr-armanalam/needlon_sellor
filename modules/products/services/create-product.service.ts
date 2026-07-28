import { generateUniqueSlug } from "@/modules/shared/slug/generate-unique-slug";
import { createProduct } from "../repository/commands/create-product";
import { createProductVariant } from "../repository/commands/create-product-variant";
import { existsProductSlug } from "../repository/queries/exists-product-slug";
import { ProductStatus, ProductVisibility } from "../types";

export interface CreateProductServiceInput {
  sellerId: string;
  categoryId: string;
  name: string;
  shortDescription?: string;
  description?: string;
  productType?: "PHYSICAL" | "DIGITAL" | "SERVICE";
  status?: ProductStatus;
  visibility?: ProductVisibility;
  isFeatured?: boolean;

  defaultVariant?: {
    sku: string;
    barcode?: string;
    price: string;
    compareAtPrice?: string;
    costPrice?: string;
    weightGrams?: number;
  };
}

export async function createProductService(input: CreateProductServiceInput) {
  if (!input.name || !input.name.trim()) {
    throw new Error("Product name is required.");
  }
  if (!input.sellerId) {
    throw new Error("Seller ID is required.");
  }
  if (!input.categoryId) {
    throw new Error("Category ID is required.");
  }

  const slug = await generateUniqueSlug(input.name, (candidate) =>
    existsProductSlug(candidate)
  );

  const product = await createProduct({
    storeId: input.sellerId,
    categoryId: input.categoryId,
    name: input.name.trim(),
    slug,
    shortDescription: input.shortDescription,
    description: input.description,
    productType: input.productType ?? "PHYSICAL",
    status: input.status ?? "DRAFT",
    visibility: input.visibility ?? "PUBLIC",
    isFeatured: input.isFeatured ?? false,
  });

  let variant = null;
  if (input.defaultVariant) {
    variant = await createProductVariant({
      productId: product.id,
      sku: input.defaultVariant.sku.trim(),
      barcode: input.defaultVariant.barcode,
      price: input.defaultVariant.price,
      compareAtPrice: input.defaultVariant.compareAtPrice,
      costPrice: input.defaultVariant.costPrice,
      weightGrams: input.defaultVariant.weightGrams,
      status: "ACTIVE",
      position: 0,
    });
  }

  return {
    ...product,
    defaultVariant: variant,
  };
}

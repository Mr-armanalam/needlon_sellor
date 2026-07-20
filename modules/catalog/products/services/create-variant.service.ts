import { createProductVariant } from "../repository/commands/create-product-variant";
import { getProduct } from "../repository/queries/get-product";
import { getProductVariantBySku } from "../repository/queries/get-product-variant";

export interface CreateVariantInput {
  productId: string;
  sku: string;
  barcode?: string;
  price: string;
  compareAtPrice?: string;
  costPrice?: string;
  weightGrams?: number;
  status?: "DRAFT" | "ACTIVE" | "INACTIVE";
  position?: number;
}

export async function createVariantService(input: CreateVariantInput) {
  if (!input.productId) {
    throw new Error("Product ID is required.");
  }
  if (!input.sku || !input.sku.trim()) {
    throw new Error("SKU is required.");
  }
  if (!input.price) {
    throw new Error("Price is required.");
  }

  const product = await getProduct(input.productId);
  if (!product) {
    throw new Error(`Parent product with ID "${input.productId}" not found.`);
  }

  const existingSku = await getProductVariantBySku(input.sku.trim());
  if (existingSku) {
    throw new Error(`Variant with SKU "${input.sku}" already exists.`);
  }

  const variant = await createProductVariant({
    productId: input.productId,
    sku: input.sku.trim(),
    barcode: input.barcode,
    price: input.price,
    compareAtPrice: input.compareAtPrice,
    costPrice: input.costPrice,
    weightGrams: input.weightGrams,
    status: input.status ?? "ACTIVE",
    position: input.position ?? 0,
  });

  return variant;
}

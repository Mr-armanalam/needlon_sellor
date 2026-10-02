import type { Product } from "@/db/schema/catalog/products";
import type { UpdateProductDto } from "../dto";

export function mergeProduct(product: Product, dto: UpdateProductDto): Product {
  return {
    ...product,
    ...dto,
    updatedAt: new Date(),
  };
}

/**
 * Legacy class wrapper for backward compatibility
 */
export class ProductUpdateMapper {
  static merge(product: Product, dto: UpdateProductDto): Product {
    return mergeProduct(product, dto);
  }
}
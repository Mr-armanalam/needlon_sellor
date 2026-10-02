import type { NewProduct } from "@/db/schema/catalog/products";
import type { CreateProductDto } from "../dto";

export function toPersistenceProduct(dto: CreateProductDto): NewProduct {
  return {
    storeId: dto.storeId,
    categoryId: dto.categoryId,
    name: dto.name,
    slug: dto.slug,
    shortDescription: dto.shortDescription,
    description: dto.description,
    productType: dto.productType as any,
    visibility: dto.visibility as any,
    status: dto.status as any,
    isFeatured: dto.isFeatured,
  };
}

/**
 * Legacy class wrapper for backward compatibility
 */
export class ProductCreateMapper {
  static toPersistence(dto: CreateProductDto): NewProduct {
    return toPersistenceProduct(dto);
  }
}
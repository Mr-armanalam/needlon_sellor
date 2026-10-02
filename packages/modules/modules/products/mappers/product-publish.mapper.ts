import type { Product } from "@/db/schema/catalog/products";

export function publishProduct(product: Product): Product {
  return {
    ...product,
    status: "PUBLISHED",
    publishedAt: new Date(),
    updatedAt: new Date(),
  };
}

export function archiveProduct(product: Product): Product {
  return {
    ...product,
    status: "ARCHIVED",
    deletedAt: new Date(),
    updatedAt: new Date(),
  };
}

export function unpublishProduct(product: Product): Product {
  return {
    ...product,
    status: "DRAFT",
    publishedAt: null,
    updatedAt: new Date(),
  };
}

/**
 * Legacy class wrapper for backward compatibility
 */
export class ProductPublishMapper {
  static publish(product: Product): Product {
    return publishProduct(product);
  }
  static archive(product: Product): Product {
    return archiveProduct(product);
  }
  static unpublish(product: Product): Product {
    return unpublishProduct(product);
  }
}
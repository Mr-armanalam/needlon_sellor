import { ProductRepository } from "../repositories/product-repository";
import { transformDbProductToDto } from "./product-transformer";

export const ProductDetailService = {
  async getProductBase(productId: string) {
    if (process.env.DATABASE_URL) {
      try {
        const record = await ProductRepository.getProductById(productId);

        if (record) {
          const [images, variants] = await Promise.all([
            ProductRepository.getProductImages(productId),
            ProductRepository.getProductVariants(productId),
          ]);

          const dto = transformDbProductToDto(record, images, variants);
          return {
            product_items: dto.product,
            product_category: dto.category,
          };
        }
      } catch (err) {
        console.warn("ProductDetailService.getProductBase DB error:", (err as Error).message);
      }
    }

    return null;
  },

  async getProductFilters(productId: string) {
    if (process.env.DATABASE_URL) {
      try {
        const attributes = await ProductRepository.getProductAttributes(productId);
        if (attributes && attributes.length > 0) {
          return attributes;
        }
      } catch (err) {
        console.warn("ProductDetailService.getProductFilters DB error:", (err as Error).message);
      }
    }

    return [];
  },
};
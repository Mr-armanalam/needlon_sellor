import { ProductRepository, type QueryProductsParams } from "../repositories/product-repository";
import { transformDbProductToDto } from "./product-transformer";

export const ProductService = {
  async getFilteredProducts(
    categoryType?: string,
    subcatSlug?: string,
    sort?: string,
    attributeFilters?: Record<string, string[]>
  ) {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await ProductRepository.getProducts({
          categoryType,
          subcatSlug,
          sort: sort as QueryProductsParams["sort"],
          attributeFilters,
          limit: 50,
        });

        if (rows && rows.length > 0) {
          const transformed = await Promise.all(
            rows.map(async (row) => {
              const [images, variants] = await Promise.all([
                ProductRepository.getProductImages(row.product.id),
                ProductRepository.getProductVariants(row.product.id),
              ]);
              return transformDbProductToDto(row, images, variants);
            })
          );
          return transformed;
        }
      } catch (err) {
        console.warn("ProductService.getFilteredProducts DB error:", (err as Error).message);
      }
    }

    return [];
  },
};
import { getMockProductsWithCategory } from "@/lib/mock-data-provider";
import { ProductRepository } from "../repositories/product-repository";
import { transformDbProductToDto } from "./product-transformer";

export const NewProductService = {
  async getByCategory(catslug: string) {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await ProductRepository.getProducts({
          categorySlug: catslug,
          limit: 20,
        });

        if (rows.length > 0) {
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
        console.warn("NewProductService.getByCategory DB fallback:", (err as Error).message);
      }
    }

    return getMockProductsWithCategory();
  },
};
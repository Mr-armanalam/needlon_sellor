import { ProductRepository } from "../repositories/product-repository";
import { transformDbProductToDto } from "./product-transformer";

export const NewProductService = {
  async getByCategory(catslug: string) {
    if (process.env.DATABASE_URL) {
      try {
        let rows = await ProductRepository.getProducts({
          categorySlug: catslug,
          limit: 20,
        });

        if ((!rows || rows.length === 0) && catslug) {
          rows = await ProductRepository.getProducts({
            limit: 20,
          });
        }

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
        console.warn("NewProductService.getByCategory DB error:", (err as Error).message);
      }
    }

    return [];
  },
};
import { ProductRepository } from "../repositories/product-repository";
import { transformDbProductToDto } from "./product-transformer";

async function fetchDbProducts(filterParams: any = {}) {
  if (!process.env.DATABASE_URL) return [];
  try {
    const rows = await ProductRepository.getProducts(filterParams);
    if (rows && rows.length > 0) {
      return await Promise.all(
        rows.map(async (row) => {
          const [images, variants] = await Promise.all([
            ProductRepository.getProductImages(row.product.id),
            ProductRepository.getProductVariants(row.product.id),
          ]);
          return transformDbProductToDto(row, images, variants);
        })
      );
    }
  } catch (err) {
    console.warn("kof-productServices DB error:", (err as Error).message);
  }
  return [];
}

export const ProductService = {
  async getPremium() {
    return await fetchDbProducts({ isFeatured: true, limit: 12 });
  },

  async getTrending() {
    return await fetchDbProducts({ limit: 12, sort: "popular" });
  },

  async getBestSeller() {
    return await fetchDbProducts({ limit: 12, sort: "popular" });
  },

  async getNewIn() {
    return await fetchDbProducts({ limit: 12, sort: "newest" });
  },

  async getRecommendation() {
    return await fetchDbProducts({ limit: 12 });
  },

  async getFiltered(filters?: any) {
    return await fetchDbProducts({ ...filters, limit: 20 });
  },
};
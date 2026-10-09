import { getMockProductsWithCategory } from "@/lib/mock-data-provider";
import { ProductRepository } from "../repositories/product-repository";
import { transformDbProductToDto } from "./product-transformer";

async function fetchDbProducts(filterParams: any = {}) {
  if (!process.env.DATABASE_URL) return null;
  try {
    const rows = await ProductRepository.getProducts(filterParams);
    if (rows.length > 0) {
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
    console.warn("kof-productServices DB fallback:", (err as Error).message);
  }
  return null;
}

export const ProductService = {
  async getPremium() {
    const dbRows = await fetchDbProducts({ isFeatured: true, limit: 12 });
    if (dbRows && dbRows.length > 0) return dbRows;
    return getMockProductsWithCategory().filter((p) => p.product.isPremium);
  },

  async getTrending() {
    const dbRows = await fetchDbProducts({ limit: 12, sort: "popular" });
    if (dbRows && dbRows.length > 0) return dbRows;
    return getMockProductsWithCategory();
  },

  async getBestSeller() {
    const dbRows = await fetchDbProducts({ limit: 12, sort: "popular" });
    if (dbRows && dbRows.length > 0) return dbRows;
    return getMockProductsWithCategory();
  },

  async getNewIn() {
    const dbRows = await fetchDbProducts({ limit: 12, sort: "newest" });
    if (dbRows && dbRows.length > 0) return dbRows;
    return getMockProductsWithCategory();
  },

  async getRecommendation() {
    const dbRows = await fetchDbProducts({ limit: 12 });
    if (dbRows && dbRows.length > 0) return dbRows;
    return getMockProductsWithCategory();
  },

  async getFiltered(filters?: any) {
    const dbRows = await fetchDbProducts({ ...filters, limit: 20 });
    if (dbRows && dbRows.length > 0) return dbRows;
    return getMockProductsWithCategory();
  },
};
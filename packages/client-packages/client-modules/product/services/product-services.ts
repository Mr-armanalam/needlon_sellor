import { getMockProductsWithCategory } from "@/lib/mock-data-provider";

export const ProductService = {
  async getFilteredProducts(categoryType?: string, subcatSlug?: string, sort?: string) {
    return getMockProductsWithCategory();
  }
};
import { getMockProductsWithCategory } from "@/lib/mock-data-provider";

export const ProductService = {
  async getPremium() {
    return getMockProductsWithCategory().filter(p => p.product.isPremium);
  },

  async getTrending() {
    return getMockProductsWithCategory();
  },

  async getBestSeller() {
    return getMockProductsWithCategory();
  },

  async getNewIn() {
    return getMockProductsWithCategory();
  },

  async getRecommendation() {
    return getMockProductsWithCategory();
  },

  async getFiltered(filters?: any) {
    return getMockProductsWithCategory();
  }
};
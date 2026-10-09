import { getMockProductsWithCategory } from "@/lib/mock-data-provider";

export const NewProductService = {
  async getByCategory(catslug: string) {
    return getMockProductsWithCategory();
  }
};
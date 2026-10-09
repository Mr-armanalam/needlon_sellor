import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data-provider";

export const ProductDetailService = {
  async getProductBase(productId: string) {
    const mockP = MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];
    const mockC = MOCK_CATEGORIES.find(c => c.id === mockP.categoryId) || MOCK_CATEGORIES[0];
    return {
      product_items: mockP,
      product_category: mockC
    };
  },

  async getProductFilters(productId: string) {
    return [
      { groupName: "Material", optionValue: "100% Cotton" },
      { groupName: "Fit", optionValue: "Slim Fit" },
      { groupName: "Pattern", optionValue: "Solid" }
    ];
  }
};
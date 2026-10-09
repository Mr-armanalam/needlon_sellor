import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data-provider";
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
        console.warn("ProductDetailService.getProductBase DB fallback:", (err as Error).message);
      }
    }

    const mockP = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];
    const mockC = MOCK_CATEGORIES.find((c) => c.id === mockP.categoryId) || MOCK_CATEGORIES[0];
    return {
      product_items: mockP,
      product_category: mockC,
    };
  },

  async getProductFilters(productId: string) {
    if (process.env.DATABASE_URL) {
      try {
        const attributes = await ProductRepository.getProductAttributes(productId);
        if (attributes.length > 0) {
          return attributes;
        }
      } catch (err) {
        console.warn("ProductDetailService.getProductFilters DB fallback:", (err as Error).message);
      }
    }

    return [
      { groupName: "Material", optionValue: "100% Cotton" },
      { groupName: "Fit", optionValue: "Slim Fit" },
      { groupName: "Pattern", optionValue: "Solid" },
    ];
  },
};
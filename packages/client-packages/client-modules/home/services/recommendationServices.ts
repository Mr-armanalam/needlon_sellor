import { MOCK_PRODUCTS } from "@/lib/mock-data-provider";

export const fetchProductsByCategory = async (categoryIds: string[], limit: number) => {
  return MOCK_PRODUCTS.slice(0, limit);
};

export const getTrendingProducts = async () => {
  return MOCK_PRODUCTS;
};

export const getNewArrivals = async (limit = 12) => {
  return MOCK_PRODUCTS.slice(0, limit);
};

export const getTopRated = async (limit = 12) => {
  return MOCK_PRODUCTS.slice(0, limit);
};
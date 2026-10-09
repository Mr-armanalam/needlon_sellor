import { ProductRepository } from "../../product/repositories/product-repository";
import { transformDbProductToDto } from "../../product/services/product-transformer";
import { DEFAULT_MOCK_PRODUCTS as MOCK_PRODUCTS } from "../../../data/mock-catalog-fallback";

async function fetchDbProducts(params: any = {}) {
  if (!process.env.DATABASE_URL) return null;
  try {
    const rows = await ProductRepository.getProducts(params);
    if (rows.length > 0) {
      const dtos = await Promise.all(
        rows.map(async (row) => {
          const [images, variants] = await Promise.all([
            ProductRepository.getProductImages(row.product.id),
            ProductRepository.getProductVariants(row.product.id),
          ]);
          return transformDbProductToDto(row, images, variants);
        })
      );
      return dtos.map((d) => d.product);
    }
  } catch (err) {
    console.warn("recommendationServices DB fallback:", (err as Error).message);
  }
  return null;
}

export const fetchProductsByCategory = async (categoryIds: string[], limit: number) => {
  const dbProds = await fetchDbProducts({ limit });
  if (dbProds && dbProds.length > 0) return dbProds;
  return MOCK_PRODUCTS.slice(0, limit);
};

export const getTrendingProducts = async () => {
  const dbProds = await fetchDbProducts({ limit: 12, sort: "popular" });
  if (dbProds && dbProds.length > 0) return dbProds;
  return MOCK_PRODUCTS;
};

export const getNewArrivals = async (limit = 12) => {
  const dbProds = await fetchDbProducts({ limit, sort: "newest" });
  if (dbProds && dbProds.length > 0) return dbProds;
  return MOCK_PRODUCTS.slice(0, limit);
};

export const getTopRated = async (limit = 12) => {
  const dbProds = await fetchDbProducts({ limit, isFeatured: true });
  if (dbProds && dbProds.length > 0) return dbProds;
  return MOCK_PRODUCTS.slice(0, limit);
};
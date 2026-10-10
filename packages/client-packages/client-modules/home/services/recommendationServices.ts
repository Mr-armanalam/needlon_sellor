import { ProductRepository } from "../../product/repositories/product-repository";
import { transformDbProductToDto } from "../../product/services/product-transformer";

async function fetchDbProducts(params: any = {}) {
  if (!process.env.DATABASE_URL) return [];
  try {
    const rows = await ProductRepository.getProducts(params);
    if (rows && rows.length > 0) {
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
    console.warn("recommendationServices DB query error:", (err as Error).message);
  }
  return [];
}

export const fetchProductsByCategory = async (categoryIds: string[], limit: number) => {
  const dbProds = await fetchDbProducts({ limit });
  return dbProds || [];
};

export const getTrendingProducts = async () => {
  const dbProds = await fetchDbProducts({ limit: 12, sort: "popular" });
  return dbProds || [];
};

export const getNewArrivals = async (limit = 12) => {
  const dbProds = await fetchDbProducts({ limit, sort: "newest" });
  return dbProds || [];
};

export const getTopRated = async (limit = 12) => {
  const dbProds = await fetchDbProducts({ limit, isFeatured: true });
  return dbProds || [];
};
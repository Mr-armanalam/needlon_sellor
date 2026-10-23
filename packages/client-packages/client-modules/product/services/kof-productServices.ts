import { ProductRepository, type QueryProductsParams } from "../repositories/product-repository";
import { transformDbProductToDto, type ProductWithCategoryDTO } from "./product-transformer";

/** Home-page sections must never render thin: curated sets (featured,
 *  seasonal, …) are backfilled with other catalogue products up to this
 *  many items. If the whole catalogue is smaller, the section simply
 *  shows everything there is. */
export const SECTION_MIN_ITEMS = 12;

async function backfillToSectionMin(
  items: ProductWithCategoryDTO[],
  fillParams: QueryProductsParams
): Promise<ProductWithCategoryDTO[]> {
  if (items.length >= SECTION_MIN_ITEMS) return items;
  const seen = new Set(items.map((item) => item.product.id));
  const fill = await fetchDbProducts({ ...fillParams, limit: SECTION_MIN_ITEMS * 2 });
  const merged = [...items];
  for (const candidate of fill) {
    if (merged.length >= SECTION_MIN_ITEMS) break;
    if (!seen.has(candidate.product.id)) {
      seen.add(candidate.product.id);
      merged.push(candidate);
    }
  }
  return merged;
}

async function fetchDbProducts(filterParams: QueryProductsParams = {}) {
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
    const featured = await fetchDbProducts({ isFeatured: true, limit: 12 });
    return await backfillToSectionMin(featured, { sort: "newest" });
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

  async getFiltered(filters?: QueryProductsParams) {
    return await fetchDbProducts({ ...filters, limit: 20 });
  },
};
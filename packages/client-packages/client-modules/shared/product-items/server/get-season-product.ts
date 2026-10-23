import { ProductService, SECTION_MIN_ITEMS } from "@/modules/product/services/kof-productServices";

export const getSeasonProduct = async ({
  seasonType = "casual",
}: {
  seasonType?: string;
} = {}) => {
  const seasonal = (
    (await ProductService.getFiltered({
      categorySlug: seasonType,
      limit: SECTION_MIN_ITEMS,
    })) || []
  ).map((item) => item.product || item);

  if (seasonal.length >= SECTION_MIN_ITEMS) {
    return seasonal.slice(0, SECTION_MIN_ITEMS);
  }

  // The season's own category rarely holds a full section on its own —
  // backfill with the newest catalogue products (de-duplicated) so the
  // section always renders a full row of 12 when the catalogue has them.
  const seen = new Set(seasonal.map((product) => product.id));
  const newest = ((await ProductService.getNewIn()) || []).map(
    (item) => item.product || item
  );
  const merged = [...seasonal];
  for (const candidate of newest) {
    if (merged.length >= SECTION_MIN_ITEMS) break;
    if (!seen.has(candidate.id)) {
      seen.add(candidate.id);
      merged.push(candidate);
    }
  }
  return merged;
};

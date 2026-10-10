import { ProductService } from "@/modules/product/services/kof-productServices";

export const getSeasonProduct = async ({
  seasonType = "casual",
}: {
  seasonType?: string;
} = {}) => {
  const result = await ProductService.getFiltered({
    categorySlug: seasonType,
    limit: 8,
  });

  return (result || []).map((item: any) => item.product || item);
};

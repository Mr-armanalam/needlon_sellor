import { ProductService } from "@/modules/product/services/kof-productServices";

export async function getProductByType({
  type,
}: {
  type: "premium" | "recommend" | "user_like" | null;
}) {
  const result = await (async () => {
    switch (type) {
      case "premium":
        return await ProductService.getPremium();
      case "recommend":
        return await ProductService.getRecommendation();
      case "user_like":
        return await ProductService.getTrending();
      default:
        return await ProductService.getBestSeller();
    }
  })();

  return (result || []).map((item: any) => item.product || item);
}

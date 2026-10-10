import { ProductService } from "@/modules/product/services/kof-productServices";

export async function getNewSectionProduct({
  type,
}: {
  type: "best-sellers" | "trending" | "arrivals" | null | string;
}) {
  if (type === "best-sellers") {
    return await ProductService.getBestSeller();
  }
  if (type === "trending") {
    return await ProductService.getTrending();
  }
  if (type === "arrivals") {
    return await ProductService.getNewIn();
  }
  return await ProductService.getRecommendation();
}

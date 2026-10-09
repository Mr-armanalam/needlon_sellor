import { getMockProductsWithCategory } from "@/lib/mock-data-provider";

export async function getNewSectionProduct({
  type,
}: {
  type: "best-sellers" | "trending" | "arrivals" | null | string;
}) {
  return getMockProductsWithCategory();
}

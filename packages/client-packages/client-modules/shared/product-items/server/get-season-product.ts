import { getMockSeasonProducts } from "@/lib/mock-data-provider";

export const getSeasonProduct = async ({
  seasonType = "casual",
}: {
  seasonType?: string;
} = {}) => {
  return getMockSeasonProducts(seasonType);
};

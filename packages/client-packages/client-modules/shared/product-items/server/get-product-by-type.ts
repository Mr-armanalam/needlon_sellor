import { MOCK_PRODUCTS } from "@/lib/mock-data-provider";

export async function getProductByType({
  type,
}: {
  type: "premium" | "recommend" | "user_like" | null;
}) {
  switch (type) {
    case "premium":
      return MOCK_PRODUCTS.filter((p) => p.isPremium);
    case "recommend":
      return MOCK_PRODUCTS.slice(0, 4);
    case "user_like":
      return MOCK_PRODUCTS.slice(2, 6);
    default:
      return MOCK_PRODUCTS;
  }
}

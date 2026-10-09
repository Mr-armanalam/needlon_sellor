import { MOCK_CATEGORIES } from "./mock-data-provider";

export async function buildUserPreferenceVector(userId: string) {
  return {
    topCategories: MOCK_CATEGORIES.slice(0, 3).map((c) => c.id),
  };
}

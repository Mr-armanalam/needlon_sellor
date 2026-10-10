import { db } from "@needlon/db";
import { categoriesTable } from "@needlon/db/db/schema/catalog/categories/table";

export async function buildUserPreferenceVector(userId: string) {
  if (process.env.DATABASE_URL) {
    try {
      const cats = await db
        .select({ id: categoriesTable.id })
        .from(categoriesTable)
        .limit(3);

      return {
        topCategories: cats.map((c) => c.id),
      };
    } catch {
      // fallback
    }
  }

  return {
    topCategories: [],
  };
}

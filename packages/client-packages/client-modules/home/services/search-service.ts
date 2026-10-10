import { db } from "@needlon/db";
import { productsTable } from "@needlon/db/db/schema/catalog/products/table";
import { categoriesTable } from "@needlon/db/db/schema/catalog/categories/table";
import { clientSearchHistoryTable } from "@needlon/db/db/schema/client/search-history";
import { eq, ilike, or, desc, sql, and } from "drizzle-orm";

export interface SearchResultItem {
  id: string;
  name: string;
  category: string;
  subcategory: string;
}

export const SearchService = {
  async searchStorefront(query: string, userId?: string) {
    const trimmedQuery = query.trim();

    // 1. Log query in search history if userId provided
    if (trimmedQuery && userId && process.env.DATABASE_URL) {
      try {
        const [existing] = await db
          .select()
          .from(clientSearchHistoryTable)
          .where(
            and(
              eq(clientSearchHistoryTable.userId, userId),
              eq(clientSearchHistoryTable.query, trimmedQuery)
            )
          )
          .limit(1);

        if (existing) {
          await db
            .update(clientSearchHistoryTable)
            .set({
              searchCount: sql`${clientSearchHistoryTable.searchCount} + 1`,
              lastSearchedAt: new Date(),
            })
            .where(eq(clientSearchHistoryTable.id, existing.id));
        } else {
          await db.insert(clientSearchHistoryTable).values({
            userId,
            query: trimmedQuery,
          });
        }
      } catch (err) {
        console.warn("Search history DB log warning:", (err as Error).message);
      }
    }

    // 2. Query products & categories
    if (process.env.DATABASE_URL && trimmedQuery) {
      try {
        const rows = await db
          .select({
            id: productsTable.id,
            name: productsTable.name,
            categoryName: categoriesTable.name,
            categorySlug: categoriesTable.slug,
          })
          .from(productsTable)
          .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
          .where(
            and(
              eq(productsTable.status, "PUBLISHED"),
              or(
                ilike(productsTable.name, `%${trimmedQuery}%`),
                ilike(productsTable.description, `%${trimmedQuery}%`),
                ilike(categoriesTable.name, `%${trimmedQuery}%`)
              )
            )
          )
          .limit(30);

        const grouped: Record<string, SearchResultItem[]> = {};
        for (const row of rows) {
          const cat = row.categoryName || "General";
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push({
            id: row.id,
            name: row.name,
            category: cat,
            subcategory: row.categorySlug || cat,
          });
        }
        return grouped;
      } catch (err) {
        console.warn("SearchStorefront DB query error:", (err as Error).message);
      }
    }

    return {};
  },

  async getSuggestions(userId?: string) {
    let recentSearches: string[] = [];
    let suggestedItems: SearchResultItem[] = [];

    // Query recent searches for user
    if (userId && process.env.DATABASE_URL) {
      try {
        const recentRows = await db
          .select({ query: clientSearchHistoryTable.query })
          .from(clientSearchHistoryTable)
          .where(eq(clientSearchHistoryTable.userId, userId))
          .orderBy(desc(clientSearchHistoryTable.lastSearchedAt))
          .limit(5);

        recentSearches = recentRows.map((r) => r.query);
      } catch (err) {
        console.warn("Get recent searches DB query error:", (err as Error).message);
      }
    }

    // Query suggested products
    if (process.env.DATABASE_URL) {
      try {
        const prods = await db
          .select({
            id: productsTable.id,
            name: productsTable.name,
            categoryName: categoriesTable.name,
            categorySlug: categoriesTable.slug,
          })
          .from(productsTable)
          .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
          .where(eq(productsTable.status, "PUBLISHED"))
          .orderBy(desc(productsTable.isFeatured), desc(productsTable.createdAt))
          .limit(6);

        if (prods.length > 0) {
          suggestedItems = prods.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.categoryName || "Fashion",
            subcategory: p.categorySlug || "apparel",
          }));
        }
      } catch (err) {
        console.warn("Get suggested items DB query error:", (err as Error).message);
      }
    }

    return {
      recent: recentSearches,
      suggested: suggestedItems,
    };
  },

  async getSubCatSearchItems() {
    if (process.env.DATABASE_URL) {
      try {
        const cats = await db
          .select({
            id: categoriesTable.id,
            name: categoriesTable.name,
            slug: categoriesTable.slug,
          })
          .from(categoriesTable)
          .limit(10);

        if (cats.length > 0) {
          return cats.map((c, i) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            catType: i % 2 === 0 ? "men" : "women",
            category: c.name.toLowerCase().includes("formal") ? "formal" : "casual",
          }));
        }
      } catch (err) {
        console.warn("GetSubCatSearchItems DB query error:", (err as Error).message);
      }
    }

    return [];
  },
};

import { db } from "@needlon/db";
import { clientHeroBannersTable } from "@needlon/db/db/schema/client/hero-banners";
import { eq, asc } from "drizzle-orm";
import { DEFAULT_MOCK_HERO_ITEMS as MOCK_HERO_ITEMS } from "../../../data/mock-catalog-fallback";

export const HeroBannerService = {
  async getActiveHeroBanners() {
    if (!process.env.DATABASE_URL) {
      return MOCK_HERO_ITEMS;
    }

    try {
      const banners = await db
        .select()
        .from(clientHeroBannersTable)
        .where(eq(clientHeroBannersTable.isActive, true))
        .orderBy(asc(clientHeroBannersTable.displayOrder));

      if (banners.length > 0) {
        return banners.map((b) => ({
          id: b.id,
          name: b.name,
          description: b.description || "",
          image: b.image,
          offer: b.offer || "",
          slug: b.slug || "",
          timestamp: b.createdAt,
        }));
      }
    } catch (err) {
      console.warn("HeroBannerService DB fallback:", (err as Error).message);
    }

    return MOCK_HERO_ITEMS;
  },
};

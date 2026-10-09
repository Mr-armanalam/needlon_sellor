import { db } from "@needlon/db";
import { wishlistTable } from "@needlon/db/db/schema/client/wishlist";
import { eq, and } from "drizzle-orm";
import { MOCK_PRODUCTS } from "@/lib/mock-data-provider";

export const WishlistService = {
  async getWishlist(userId: string) {
    if (!process.env.DATABASE_URL) {
      return this.getMockWishlist(userId);
    }

    try {
      const items = await db
        .select()
        .from(wishlistTable)
        .where(eq(wishlistTable.userId, userId));
      return items;
    } catch (error) {
      console.warn("Get wishlist DB query fallback:", (error as Error).message);
      return this.getMockWishlist(userId);
    }
  },

  getMockWishlist(userId: string) {
    return MOCK_PRODUCTS.slice(0, 3).map((p) => ({
      id: `wishlist-${p.id}`,
      userId,
      productId: p.id,
      createdAt: new Date(),
      product: p,
    }));
  },

  async toggleWishlist(userId: string, productId: string) {
    if (!process.env.DATABASE_URL) {
      return { added: true };
    }

    try {
      const [existing] = await db
        .select()
        .from(wishlistTable)
        .where(and(eq(wishlistTable.userId, userId), eq(wishlistTable.productId, productId)))
        .limit(1);

      if (existing) {
        await db
          .delete(wishlistTable)
          .where(eq(wishlistTable.id, existing.id));
        return { added: false };
      } else {
        await db.insert(wishlistTable).values({ userId, productId });
        return { added: true };
      }
    } catch (error) {
      console.warn("Toggle wishlist DB query fallback:", (error as Error).message);
      return { added: true };
    }
  },

  async removeFromWishlist(userId: string, productId: string) {
    if (!process.env.DATABASE_URL) {
      return true;
    }
    try {
      await db
        .delete(wishlistTable)
        .where(and(eq(wishlistTable.userId, userId), eq(wishlistTable.productId, productId)));
      return true;
    } catch (error) {
      console.warn("Remove from wishlist DB fallback:", (error as Error).message);
      return true;
    }
  },
};

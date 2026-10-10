import { db } from "@needlon/db";
import { wishlistTable } from "@needlon/db/db/schema/client/wishlist";
import { productsTable } from "@needlon/db/db/schema/catalog/products/table";
import { productVariantsTable } from "@needlon/db/db/schema/catalog/products/product-variants/table";
import { pricingTable } from "@needlon/db/db/schema/catalog/products/pricing/table";
import { productImagesTable } from "@needlon/db/db/schema/catalog/products/product-images/table";
import { eq, and, desc, asc, inArray } from "drizzle-orm";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUuid(id: string): boolean {
  return typeof id === "string" && UUID_REGEX.test(id);
}

export interface WishlistItemDto {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
  updatedAt: Date;
}

export const WishlistService = {
  /**
   * Fetch buyer wishlist items enriched with product title, current pricing, and primary image.
   */
  async getWishlist(userId: string): Promise<WishlistItemDto[]> {
    if (!process.env.DATABASE_URL || !isValidUuid(userId)) {
      return [];
    }

    try {
      const items = await db
        .select()
        .from(wishlistTable)
        .where(eq(wishlistTable.userId, userId))
        .orderBy(desc(wishlistTable.createdAt));

      if (items.length === 0) {
        return [];
      }

      const productIds = Array.from(new Set(items.map((i) => i.productId)));

      // 1. Fetch products
      const products = await db
        .select()
        .from(productsTable)
        .where(inArray(productsTable.id, productIds));
      const productMap = new Map(products.map((p) => [p.id, p]));

      // 2. Fetch primary images
      const images = await db
        .select()
        .from(productImagesTable)
        .where(inArray(productImagesTable.productId, productIds))
        .orderBy(asc(productImagesTable.displayOrder));
      const imageMap = new Map<string, string>();
      for (const img of images) {
        if (!imageMap.has(img.productId)) {
          imageMap.set(img.productId, img.imageUrl);
        }
      }

      // 3. Fetch pricing
      const variants = await db
        .select({
          variant: productVariantsTable,
          pricing: pricingTable,
        })
        .from(productVariantsTable)
        .leftJoin(pricingTable, eq(productVariantsTable.id, pricingTable.variantId))
        .where(inArray(productVariantsTable.productId, productIds));

      const priceMap = new Map<string, number>();
      for (const v of variants) {
        const pId = v.variant.productId;
        if (!priceMap.has(pId)) {
          const sellingPrice = v.pricing?.price ? Number(v.pricing.price) : null;
          const basePrice = v.pricing?.compareAtPrice ? Number(v.pricing.compareAtPrice) : 2499;
          priceMap.set(pId, sellingPrice ?? basePrice);
        }
      }

      // Map to UI WishlistItem shape
      return items.map((w) => {
        const prod = productMap.get(w.productId);
        const imgUrl =
          imageMap.get(w.productId) ||
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600";
        const price = priceMap.get(w.productId) ?? 2499;

        return {
          id: w.id,
          productId: w.productId,
          name: prod?.name || "Needlon Tailored Product",
          price,
          quantity: 1,
          size: "M",
          image: imgUrl,
          updatedAt: w.createdAt,
        };
      });
    } catch (error) {
      console.warn("Get wishlist DB query error:", (error as Error).message);
      return [];
    }
  },

  /**
   * Toggle product bookmark in buyer's wishlist.
   */
  async toggleWishlist(userId: string, productId: string) {
    if (!process.env.DATABASE_URL || !isValidUuid(userId) || !isValidUuid(productId)) {
      return { added: false, removed: false };
    }

    try {
      const [existing] = await db
        .select()
        .from(wishlistTable)
        .where(and(eq(wishlistTable.userId, userId), eq(wishlistTable.productId, productId)))
        .limit(1);

      if (existing) {
        await db.delete(wishlistTable).where(eq(wishlistTable.id, existing.id));
        return { added: false, removed: true };
      } else {
        await db.insert(wishlistTable).values({ userId, productId });
        return { added: true, removed: false };
      }
    } catch (error) {
      console.warn("Toggle wishlist DB query fallback:", (error as Error).message);
      return { added: true, removed: false };
    }
  },

  /**
   * Remove item from wishlist by userId and productId.
   */
  async removeFromWishlist(userId: string, productId: string) {
    if (!process.env.DATABASE_URL || !isValidUuid(userId) || !isValidUuid(productId)) {
      return { success: true, removed: true };
    }

    try {
      await db
        .delete(wishlistTable)
        .where(and(eq(wishlistTable.userId, userId), eq(wishlistTable.productId, productId)));
      return { success: true, removed: true };
    } catch (error) {
      console.warn("Remove from wishlist DB fallback:", (error as Error).message);
      return { success: true, removed: true };
    }
  },

  /**
   * Synchronize guest localStorage wishlist items into user's DB wishlist on login.
   */
  async syncGuestWishlist(userId: string, guestItems: any[]) {
    if (!process.env.DATABASE_URL || !isValidUuid(userId) || !Array.isArray(guestItems) || guestItems.length === 0) {
      return { success: true, count: 0 };
    }

    try {
      // Find existing wishlist products
      const existing = await db
        .select({ productId: wishlistTable.productId })
        .from(wishlistTable)
        .where(eq(wishlistTable.userId, userId));

      const existingSet = new Set(existing.map((e) => e.productId));
      let addedCount = 0;

      for (const item of guestItems) {
        const pId = item.productId || item.id;
        if (pId && isValidUuid(pId) && !existingSet.has(pId)) {
          await db.insert(wishlistTable).values({ userId, productId: pId });
          existingSet.add(pId);
          addedCount++;
        }
      }

      return { success: true, count: addedCount };
    } catch (error) {
      console.warn("syncGuestWishlist fallback:", (error as Error).message);
      return { success: true, count: 0 };
    }
  },
};

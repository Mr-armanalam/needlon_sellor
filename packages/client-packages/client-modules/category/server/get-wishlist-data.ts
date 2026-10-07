"use server";
import { db } from "@/db";
import { wishListItems } from "@/db/schema/wishlist-items";
import { eq } from "drizzle-orm";
import { MOCK_WISHLIST_ITEMS } from "@/lib/mock-data-provider";

export const getWishlistData = async (userId: string) => {
  try {
    if (!userId)
      return { message: "Something is wrong", status: 500, data: [] };

    const wishlist = await db
      .select()
      .from(wishListItems)
      .where(eq(wishListItems.userId, userId));

    if (wishlist.length === 0) {
      return { message: "No wishList Item", status: 200, data: [] };
    }
    return { message: "success", status: 200, data: wishlist };
  } catch (error) {
    console.warn("DB failed in getWishlistData, using mock wishlist:", error);
    return { message: "success", status: 200, data: MOCK_WISHLIST_ITEMS };
  }
};

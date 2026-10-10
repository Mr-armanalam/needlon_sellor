"use server";
import { WishlistService } from "@/modules/account/services/wishlist-service";

export const getWishlistData = async (userId: string) => {
  try {
    const items = await WishlistService.getWishlist(userId);
    return { message: "success", status: 200, data: items };
  } catch (error) {
    return { message: "error", status: 500, data: [] };
  }
};

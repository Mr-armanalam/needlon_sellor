"use server";
import { MOCK_WISHLIST_ITEMS } from "@/lib/mock-data-provider";

export const getWishlistData = async (userId: string) => {
  return { message: "success", status: 200, data: MOCK_WISHLIST_ITEMS };
};

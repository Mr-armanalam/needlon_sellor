import { NextRequest, NextResponse } from "next/server";
import { WishlistService } from "@/modules/account/services/wishlist-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const userId = body.userId || "mock-user";
    const guestItems = body.items || body.guestItems || [];

    const result = await WishlistService.syncGuestWishlist(userId, guestItems);
    return NextResponse.json({ ...result }, { status: 200 });
  } catch (error) {
    console.error("SYNC_WISHLIST_ERROR:", error);
    return NextResponse.json({ error: "Failed to sync wishlist" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { WishlistService } from "@/modules/account/services/wishlist-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "mock-user";
    const items = await WishlistService.getWishlist(userId);
    return NextResponse.json({ success: true, items }, { status: 200 });
  } catch (error) {
    console.error("GET_WISHLIST_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { userId = "mock-user", productId, action = "toggle" } = body;

    if (action === "remove" && productId) {
      await WishlistService.removeFromWishlist(userId, productId);
      return NextResponse.json({ removed: true }, { status: 200 });
    }

    if (productId) {
      const result = await WishlistService.toggleWishlist(userId, productId);
      return NextResponse.json({ success: true, ...result }, { status: 200 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("POST_WISHLIST_ERROR:", error);
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
  }
}

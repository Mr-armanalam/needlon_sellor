import { NextRequest, NextResponse } from "next/server";
import { WishlistService } from "@/modules/account/services/wishlist-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ success: true, items: [] }, { status: 200 });
    }
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
    const { userId, productId, action = "toggle", exists } = body;

    if (!userId) {
      return NextResponse.json({ error: "User authentication required" }, { status: 400 });
    }

    // 1. Guest items synchronization
    if (body.items || body.guestItems || body.syncItems) {
      const itemsToSync = body.items || body.guestItems || body.syncItems;
      const syncResult = await WishlistService.syncGuestWishlist(userId, itemsToSync);
      return NextResponse.json({ ...syncResult }, { status: 200 });
    }

    // 2. Explicit remove action
    if ((action === "remove" || exists === true) && productId) {
      await WishlistService.removeFromWishlist(userId, productId);
      return NextResponse.json({ success: true, removed: true }, { status: 200 });
    }

    // 3. Toggle wishlist
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

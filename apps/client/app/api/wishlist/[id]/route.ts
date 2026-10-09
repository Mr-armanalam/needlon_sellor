import { NextRequest, NextResponse } from "next/server";
import { WishlistService } from "@/modules/account/services/wishlist-service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const items = await WishlistService.getWishlist(id);
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("GET_WISHLIST_BY_ID_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

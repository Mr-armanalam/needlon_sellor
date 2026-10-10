import { NextRequest, NextResponse } from "next/server";
import { CartService } from "@/modules/cart/services/cart-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const userId = body.userId;
    const guestItems = body.items || body.guestItems || [];

    if (!userId) {
      return NextResponse.json({ success: false, message: "User authentication required" }, { status: 400 });
    }

    const updatedCart = await CartService.syncGuestCart(userId, guestItems);
    return NextResponse.json({ success: true, cart: updatedCart }, { status: 200 });
  } catch (error) {
    console.error("SYNC_CART_ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to sync cart" }, { status: 500 });
  }
}

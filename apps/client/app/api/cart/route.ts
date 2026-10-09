import { NextRequest, NextResponse } from "next/server";
import { CartService } from "@/modules/cart/services/cart-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "mock-user";
    const items = await CartService.getCart(userId);
    return NextResponse.json({ success: true, cart: items }, { status: 200 });
  } catch (error) {
    console.error("GET_CART_ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const userId = body.userId || "mock-user";
    const cartItem = body.cartItem || body;

    const dto = {
      productId: cartItem.productId || "p-101",
      quantity: Number(cartItem.quantity) || 1,
      size: cartItem.size,
      color: cartItem.color,
    };

    const created = await CartService.addToCart(userId, dto);
    return NextResponse.json({ success: true, created }, { status: 200 });
  } catch (error) {
    console.error("POST_CART_ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to add to cart" }, { status: 500 });
  }
}

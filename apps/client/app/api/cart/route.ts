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

    // 1. Check for guest cart synchronization
    if (body.syncItems || body.guestItems) {
      const itemsToSync = body.syncItems || body.guestItems;
      const updatedCart = await CartService.syncGuestCart(userId, itemsToSync);
      return NextResponse.json({ success: true, cart: updatedCart }, { status: 200 });
    }

    const cartItem = body.cartItem || body;
    const productId = cartItem.productId || "p-101";
    const size = cartItem.size;

    // 2. Check for decrement or removal action
    if (body.removeQuantity) {
      const decResult = await CartService.removeOrDecrement(
        userId,
        productId,
        size,
        Number(body.removeQuantity) || 1
      );
      return NextResponse.json(decResult, { status: 200 });
    }

    // 3. Normal Add to Cart
    const dto = {
      productId,
      quantity: Number(cartItem.quantity) || Number(body.addQuantity) || 1,
      size,
      color: cartItem.color,
    };

    const result = await CartService.addToCart(userId, dto);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("POST_CART_ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to process cart request" }, { status: 500 });
  }
}

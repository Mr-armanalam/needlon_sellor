import { NextRequest, NextResponse } from "next/server";
import { CartService } from "@/modules/cart/services/cart-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ success: true, cart: [] }, { status: 200 });
    }
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
    const userId = body.userId;

    if (!userId) {
      return NextResponse.json({ success: false, message: "User authentication required" }, { status: 400 });
    }

    // 1. Check for guest cart synchronization
    if (body.syncItems || body.guestItems || body.items) {
      const itemsToSync = body.syncItems || body.guestItems || body.items;
      const updatedCart = await CartService.syncGuestCart(userId, itemsToSync);
      return NextResponse.json({ success: true, cart: updatedCart }, { status: 200 });
    }

    const cartItem = body.cartItem || body;
    const productId = cartItem.productId || cartItem.id;
    const size = cartItem.size;

    if (!productId) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

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

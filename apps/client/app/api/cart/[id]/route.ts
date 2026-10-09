import { NextRequest, NextResponse } from "next/server";
import { CartService } from "@/modules/cart/services/cart-service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cartItems = await CartService.getCart(id);
    return NextResponse.json(cartItems, { status: 200 });
  } catch (error) {
    console.error("GET_CART_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await CartService.removeFromCart(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE_CART_ITEM_ERROR:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    await CartService.updateQuantity(id, body.quantity);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("PATCH_CART_ITEM_ERROR:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

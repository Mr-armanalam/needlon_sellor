import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { cartItems } from "@/db/schema/cart-items";
import { productItems } from "@/db/schema/product-items";
import { MOCK_CART_ITEMS, MOCK_PRODUCTS } from "@/lib/mock-data-provider";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id)
      return NextResponse.json(
        { success: false, message: "Bad request" },
        { status: 400 }
      );

    const cartItem = await db
      .select({
        id: cartItems.id,
        userId: cartItems.userId,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        size: cartItems.size,
        status: cartItems.status,
        createdAt: cartItems.createdAt,
        updatedAt: cartItems.updatedAt,
        name: productItems.name,
        price: productItems.price,
        mrp_price: productItems.mrp_price,
        image: productItems.image,
        modalImage: productItems.modalImage,
      })
      .from(cartItems)
      .where(eq(cartItems.userId, id))
      .innerJoin(productItems, eq(cartItems.productId, productItems.id));

    if (cartItem && cartItem.length > 0) {
      return NextResponse.json(cartItem, { status: 200 });
    }
  } catch (error) {
    console.log("Cart fetch DB error, falling back to mock:", error);
  }

  const mockCart = MOCK_CART_ITEMS.map((ci) => {
    const prod = MOCK_PRODUCTS.find((p) => p.id === ci.productId) || MOCK_PRODUCTS[0];
    return {
      id: ci.id,
      userId: "mock-user",
      productId: ci.productId,
      quantity: ci.quantity,
      size: ci.size,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      name: prod.name,
      price: prod.price,
      mrp_price: prod.mrp_price,
      image: prod.image,
      modalImage: prod.modalImage,
    };
  });
  return NextResponse.json(mockCart, { status: 200 });
}

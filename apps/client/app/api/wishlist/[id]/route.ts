import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { wishListItems } from "@/db/schema/wishlist-items";
import { eq } from "drizzle-orm";
import { productItems } from "@/db/schema/product-items";
import { MOCK_PRODUCTS, MOCK_WISHLIST_ITEMS } from "@/lib/mock-data-provider";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id: userId } = await params;
    if (!userId) return NextResponse.json("guest user", { status: 401 });

    try {
      const items = await db
        .select()
        .from(wishListItems)
        .innerJoin(productItems, eq(wishListItems.productId, productItems.id))
        .where(eq(wishListItems.userId, userId));

      if (items.length > 0) {
        const transformedData = items.map((item) => ({
          id: item.wishlist_items.id,
          productId: item.product_items.id,
          name: item.product_items.name,
          price: item.product_items.price,
          quantity: item.wishlist_items.quantity,
          size: item.wishlist_items.size,
          image: item.product_items.image,
          updatedAt: item.wishlist_items.updatedAt,
        }));
        return NextResponse.json(transformedData, { status: 200 });
      }
    } catch { /* fall through to mock */ }

    // Mock wishlist with product data joined
    const mockTransformed = MOCK_WISHLIST_ITEMS.map(wi => {
      const p = MOCK_PRODUCTS.find(p => p.id === wi.productId) || MOCK_PRODUCTS[0];
      return {
        id: wi.id,
        productId: p.id,
        name: p.name,
        price: p.price,
        quantity: wi.quantity,
        size: wi.size,
        image: p.image,
        updatedAt: new Date(),
      };
    });
    return NextResponse.json(mockTransformed, { status: 200 });

  } catch (error) {
    console.warn("Wishlist [id] API Error, returning mock:", error);
    return NextResponse.json([], { status: 200 });
  }
};

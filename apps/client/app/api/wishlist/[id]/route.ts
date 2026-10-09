import { NextRequest, NextResponse } from "next/server";
import { MOCK_PRODUCTS, MOCK_WISHLIST_ITEMS } from "@/lib/mock-data-provider";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const mockTransformed = MOCK_WISHLIST_ITEMS.map((wi) => {
    const p = MOCK_PRODUCTS.find((p) => p.id === wi.productId) || MOCK_PRODUCTS[0];
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
};

import { NextResponse } from "next/server";
import { db } from "@/db"; // Path to your drizzle db instance
import { wishListItems } from "@/db/schema/wishlist-items";

export async function POST(req: Request) {
  try {
    const { userId, items } = await req.json();    

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "No items to sync" }, { status: 200 });
    }

    const valuesToInsert = items.map((item) => ({
      userId,
      productId: item.productId,
      name: item.name,
      price: String(item.price),
      image: item.image,
      size: item.size || "s",
      updatedAt: new Date(),
    }));

    await db
      .insert(wishListItems)
      .values(valuesToInsert)
      .onConflictDoUpdate({
        target: [
          wishListItems.userId, 
          wishListItems.productId, 
          wishListItems.size
        ],
        set: { updatedAt: new Date() },
      });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.warn("Wishlist sync DB error, graceful fallback:", error);
    return NextResponse.json({ success: true, mocked: true }, { status: 200 });
  }
}
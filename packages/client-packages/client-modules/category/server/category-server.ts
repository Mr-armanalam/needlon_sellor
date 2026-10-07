"use server";

import { db } from "@/db";
import { cartItems } from "@/db/schema/cart-items";
import { and, eq } from "drizzle-orm";

export const addToCart = async (
  userId: string | undefined,
  productId: string,
  size: string
) => {
  if (!productId && !size && !userId) return null;

  const [existingCartItem] = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.id, String(productId)), eq(cartItems.size, size)));

  if (existingCartItem) {
    const [updatedCartItem] = await db
      .update(cartItems)
      .set({
        quantity: existingCartItem.quantity + 1,
      })
      .returning();

    return JSON.stringify(updatedCartItem);
  } else {
    if (!userId) return;
    const [newCartItem] = await db
      .insert(cartItems)
      .values({
        productId,
        userId,
        size,
        quantity: 1,
      })
      .returning();

    return JSON.stringify(newCartItem);
  }
};

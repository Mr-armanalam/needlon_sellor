/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { eq, inArray } from "drizzle-orm";

// Tables
import { orders } from "@/db/schema/orders";
import { orderItems } from "@/db/schema/order-items";
import { wishListItems } from "@/db/schema/wishlist-items";
import { userViewHistory } from "@/db/schema/user-view-history";
import { productItems } from "@/db/schema/product-items";

/**
 * Score Weights:
 * - View       → +2
 * - Wishlist   → +5
 * - Purchased  → +10
 */
export async function buildUserPreferenceVector(userId: string) {
  // ------------------------------
  // 1️⃣ FETCH ALL USER INTERACTIONS
  // ------------------------------

  const views = await db
    .select()
    .from(userViewHistory)
    .where(eq(userViewHistory.userId, userId));

  const wishlists = await db
    .select()
    .from(wishListItems)
    .where(eq(wishListItems.userId, userId));

  // Purchases (JOIN orders → order_items)
  const purchasedProducts = await db
    .select({
      productId: orderItems.productId,
    })
    .from(orderItems)
    .leftJoin(orders, eq(orders.id, orderItems.orderId))
    .where(eq(orders.userId, userId));

  // ------------------------------
  // 2️⃣ SCORING MAPS
  // ------------------------------
  const categoryScore: Record<string, number> = {};
 
  const addScore = (p: any, score: number) => {
    if (!p) return;

    if (p.categoryId) {
      categoryScore[p.categoryId] =
        (categoryScore[p.categoryId] ?? 0) + score;
    }
  };

  // ------------------------------
  // 3️⃣ PROCESS ALL INTERACTIONS
  // ------------------------------

  // ---- Views → score 2
  if (views.length > 0) {
    const ids = views.map((v) => v.productId);

    const products = await db
      .select()
      .from(productItems)
      .where(inArray(productItems.id, ids));

    for (const p of products) addScore(p, 2);
  }

  // ---- Wishlist → score 5
  if (wishlists.length > 0) {
    const ids = wishlists.map((w) => w.productId);

    const products = await db
      .select()
      .from(productItems)
      .where(inArray(productItems.id, ids));

    for (const p of products) addScore(p, 5);
  }

  // ---- Purchases → score 10
  if (purchasedProducts.length > 0) {
    const ids = purchasedProducts.map((p) => p.productId);

    const products = await db
      .select()
      .from(productItems)
      .where(inArray(productItems.id, ids));

    for (const p of products) addScore(p, 10);
  }

  // ------------------------------
  // 4️⃣ SORT & RETURN
  // ------------------------------
  const topCategories = Object.entries(categoryScore)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id]) => id);

  return {
    topCategories,
  };
}

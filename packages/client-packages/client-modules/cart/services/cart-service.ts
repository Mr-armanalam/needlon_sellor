import { db } from "@needlon/db";
import { cartTable, cartItemsTable } from "@needlon/db/db/schema/client/cart";
import { eq, and } from "drizzle-orm";
import { MOCK_CART_ITEMS, MOCK_PRODUCTS } from "@/lib/mock-data-provider";

export interface AddToCartDto {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export const CartService = {
  async getCart(userId: string) {
    if (!process.env.DATABASE_URL) {
      return this.getMockCart(userId);
    }

    try {
      const [userCart] = await db
        .select()
        .from(cartTable)
        .where(eq(cartTable.userId, userId))
        .limit(1);

      if (!userCart) {
        return [];
      }

      const items = await db
        .select()
        .from(cartItemsTable)
        .where(eq(cartItemsTable.cartId, userCart.id));

      return items;
    } catch (error) {
      console.warn("Get cart DB query fallback:", (error as Error).message);
      return this.getMockCart(userId);
    }
  },

  getMockCart(userId: string) {
    return MOCK_CART_ITEMS.map((ci) => {
      const prod = MOCK_PRODUCTS.find((p) => p.id === ci.productId) || MOCK_PRODUCTS[0];
      return {
        id: ci.id,
        userId,
        productId: ci.productId,
        quantity: ci.quantity,
        size: ci.size,
        name: prod.name,
        price: prod.price,
        mrp_price: prod.mrp_price,
        image: prod.image,
        modalImage: prod.modalImage,
      };
    });
  },

  async addToCart(userId: string, dto: AddToCartDto) {
    if (!process.env.DATABASE_URL) {
      return { id: "mock-cart-item", userId, ...dto };
    }

    try {
      let [userCart] = await db
        .select()
        .from(cartTable)
        .where(eq(cartTable.userId, userId))
        .limit(1);

      if (!userCart) {
        [userCart] = await db
          .insert(cartTable)
          .values({ userId })
          .returning();
      }

      const [existingItem] = await db
        .select()
        .from(cartItemsTable)
        .where(and(eq(cartItemsTable.cartId, userCart.id), eq(cartItemsTable.productId, dto.productId)))
        .limit(1);

      if (existingItem) {
        const [updated] = await db
          .update(cartItemsTable)
          .set({
            quantity: existingItem.quantity + dto.quantity,
            size: dto.size || existingItem.size,
            color: dto.color || existingItem.color,
            updatedAt: new Date(),
          })
          .where(eq(cartItemsTable.id, existingItem.id))
          .returning();
        return updated;
      }

      const [inserted] = await db
        .insert(cartItemsTable)
        .values({
          cartId: userCart.id,
          productId: dto.productId,
          quantity: dto.quantity,
          size: dto.size,
          color: dto.color,
        })
        .returning();

      return inserted;
    } catch (error) {
      console.warn("Add to cart DB query fallback:", (error as Error).message);
      return { id: "mock-cart-item", userId, ...dto };
    }
  },

  async updateQuantity(itemId: string, quantity: number) {
    if (!process.env.DATABASE_URL) {
      return true;
    }
    try {
      if (quantity <= 0) {
        await db.delete(cartItemsTable).where(eq(cartItemsTable.id, itemId));
      } else {
        await db
          .update(cartItemsTable)
          .set({ quantity, updatedAt: new Date() })
          .where(eq(cartItemsTable.id, itemId));
      }
      return true;
    } catch (error) {
      console.warn("Update cart quantity DB fallback:", (error as Error).message);
      return true;
    }
  },

  async removeFromCart(itemId: string) {
    if (!process.env.DATABASE_URL) {
      return true;
    }
    try {
      await db.delete(cartItemsTable).where(eq(cartItemsTable.id, itemId));
      return true;
    } catch (error) {
      console.warn("Remove from cart DB fallback:", (error as Error).message);
      return true;
    }
  },
};

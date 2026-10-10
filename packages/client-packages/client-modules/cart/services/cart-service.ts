import { db } from "@needlon/db";
import { cartTable, cartItemsTable } from "@needlon/db/db/schema/client/cart";
import { productsTable } from "@needlon/db/db/schema/catalog/products/table";
import { productVariantsTable } from "@needlon/db/db/schema/catalog/products/product-variants/table";
import { pricingTable } from "@needlon/db/db/schema/catalog/products/pricing/table";
import { inventoryTable } from "@needlon/db/db/schema/catalog/products/inventory/table";
import { productImagesTable } from "@needlon/db/db/schema/catalog/products/product-images/table";
import { eq, and, desc, asc, inArray } from "drizzle-orm";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUuid(id: string): boolean {
  return typeof id === "string" && UUID_REGEX.test(id);
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface CartItemDto {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  size: string;
  color?: string;
  name: string;
  price: number;
  mrp_price: number;
  image: string;
  modalImage?: string;
  stockQuantity: number;
  inStock: boolean;
  shippingCharge: number;
  updatedAt: Date;
}

export const CartService = {
  /**
   * Fetch user cart with enriched product details, images, pricing, and live inventory.
   */
  async getCart(userId: string): Promise<CartItemDto[]> {
    if (!process.env.DATABASE_URL || !isValidUuid(userId)) {
      return [];
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
        .where(eq(cartItemsTable.cartId, userCart.id))
        .orderBy(desc(cartItemsTable.createdAt));

      if (items.length === 0) {
        return [];
      }

      const productIds = Array.from(new Set(items.map((i) => i.productId)));

      // 1. Fetch products
      const products = await db
        .select()
        .from(productsTable)
        .where(inArray(productsTable.id, productIds));
      const productMap = new Map(products.map((p) => [p.id, p]));

      // 2. Fetch images (ordered)
      const images = await db
        .select()
        .from(productImagesTable)
        .where(inArray(productImagesTable.productId, productIds))
        .orderBy(asc(productImagesTable.displayOrder));
      const imageMap = new Map<string, string>();
      for (const img of images) {
        if (!imageMap.has(img.productId)) {
          imageMap.set(img.productId, img.imageUrl);
        }
      }

      // 3. Fetch variants with pricing & inventory
      const variants = await db
        .select({
          variant: productVariantsTable,
          pricing: pricingTable,
          inventory: inventoryTable,
        })
        .from(productVariantsTable)
        .leftJoin(pricingTable, eq(productVariantsTable.id, pricingTable.variantId))
        .leftJoin(inventoryTable, eq(productVariantsTable.id, inventoryTable.variantId))
        .where(inArray(productVariantsTable.productId, productIds));

      const variantMap = new Map<string, typeof variants[0]>();
      const totalStockMap = new Map<string, number>();

      for (const v of variants) {
        const pId = v.variant.productId;
        if (!variantMap.has(pId)) {
          variantMap.set(pId, v);
        }
        const avail = Math.max(0, (v.inventory?.quantity ?? 0) - (v.inventory?.reservedQuantity ?? 0));
        totalStockMap.set(pId, (totalStockMap.get(pId) ?? 0) + avail);
      }

      // Map to UI CartItem shape
      return items.map((ci) => {
        const prod = productMap.get(ci.productId);
        const vInfo = variantMap.get(ci.productId);
        const imgUrl =
          imageMap.get(ci.productId) ||
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600";

        const sellingPrice = vInfo?.pricing?.price ? Number(vInfo.pricing.price) : null;
        const basePrice = vInfo?.pricing?.compareAtPrice ? Number(vInfo.pricing.compareAtPrice) : 2499;
        const finalPrice = sellingPrice ?? basePrice;
        const totalStock = totalStockMap.get(ci.productId) ?? 50;

        return {
          id: ci.id,
          userId,
          productId: ci.productId,
          quantity: ci.quantity,
          size: ci.size || "M",
          color: ci.color ?? undefined,
          name: prod?.name || "Needlon Tailored Product",
          price: finalPrice,
          mrp_price: basePrice,
          image: imgUrl,
          modalImage: imgUrl,
          stockQuantity: totalStock,
          inStock: totalStock > 0,
          shippingCharge: finalPrice >= 1999 ? 0 : 49,
          updatedAt: ci.updatedAt,
        };
      });
    } catch (error) {
      console.warn("Get cart DB query fallback:", (error as Error).message);
      return [];
    }
  },

  /**
   * Add item to cart with stock validation and quantity merging.
   */
  async addToCart(userId: string, dto: AddToCartDto) {
    if (!process.env.DATABASE_URL || !isValidUuid(userId)) {
      return { success: false, created: false, message: "Valid user ID required" };
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

      // Check available inventory if productId is UUID
      if (isValidUuid(dto.productId)) {
        const variants = await db
          .select({
            variant: productVariantsTable,
            inventory: inventoryTable,
          })
          .from(productVariantsTable)
          .leftJoin(inventoryTable, eq(productVariantsTable.id, inventoryTable.variantId))
          .where(eq(productVariantsTable.productId, dto.productId));

        if (variants.length > 0) {
          const totalStock = variants.reduce(
            (sum, v) => sum + Math.max(0, (v.inventory?.quantity ?? 0) - (v.inventory?.reservedQuantity ?? 0)),
            0
          );
          if (totalStock <= 0 && !variants.some((v) => v.inventory?.allowBackorder)) {
            return {
              success: false,
              created: false,
              outOfStock: true,
              message: "Product is currently out of stock",
            };
          }
        }
      }

      // Check existing item matching product + size
      const conditions = [
        eq(cartItemsTable.cartId, userCart.id),
        eq(cartItemsTable.productId, dto.productId),
      ];
      if (dto.size) {
        conditions.push(eq(cartItemsTable.size, dto.size));
      }

      const [existingItem] = await db
        .select()
        .from(cartItemsTable)
        .where(and(...conditions))
        .limit(1);

      if (existingItem) {
        const [updated] = await db
          .update(cartItemsTable)
          .set({
            quantity: existingItem.quantity + (Number(dto.quantity) || 1),
            size: dto.size || existingItem.size,
            color: dto.color || existingItem.color,
            updatedAt: new Date(),
          })
          .where(eq(cartItemsTable.id, existingItem.id))
          .returning();
        return { success: true, created: true, item: updated };
      }

      const [inserted] = await db
        .insert(cartItemsTable)
        .values({
          cartId: userCart.id,
          productId: dto.productId,
          quantity: Math.max(1, Number(dto.quantity) || 1),
          size: dto.size || "M",
          color: dto.color,
        })
        .returning();

      return { success: true, created: true, item: inserted };
    } catch (error) {
      console.warn("Add to cart DB query error:", (error as Error).message);
      return { success: false, created: false, message: (error as Error).message };
    }
  },

  /**
   * Remove or decrement quantity for product/size.
   */
  async removeOrDecrement(
    userId: string,
    productId: string,
    size?: string,
    decrementQuantity: number = 1
  ) {
    if (!process.env.DATABASE_URL || !isValidUuid(userId)) {
      return { success: true, removed: true };
    }

    try {
      const [userCart] = await db
        .select()
        .from(cartTable)
        .where(eq(cartTable.userId, userId))
        .limit(1);

      if (!userCart) {
        return { success: true, removed: false };
      }

      const conditions = [
        eq(cartItemsTable.cartId, userCart.id),
        eq(cartItemsTable.productId, productId),
      ];
      if (size) {
        conditions.push(eq(cartItemsTable.size, size));
      }

      const [existingItem] = await db
        .select()
        .from(cartItemsTable)
        .where(and(...conditions))
        .limit(1);

      if (!existingItem) {
        return { success: true, removed: false };
      }

      const newQty = existingItem.quantity - decrementQuantity;
      if (newQty <= 0) {
        await db.delete(cartItemsTable).where(eq(cartItemsTable.id, existingItem.id));
        return { success: true, removed: true };
      } else {
        const [updated] = await db
          .update(cartItemsTable)
          .set({ quantity: newQty, updatedAt: new Date() })
          .where(eq(cartItemsTable.id, existingItem.id))
          .returning();
        return { success: true, decremented: true, item: updated };
      }
    } catch (error) {
      console.warn("removeOrDecrement fallback:", (error as Error).message);
      return { success: true, removed: true };
    }
  },

  /**
   * Update quantity directly by item ID.
   */
  async updateQuantity(itemId: string, quantity: number) {
    if (!process.env.DATABASE_URL || !isValidUuid(itemId)) {
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

  /**
   * Remove item directly by item ID.
   */
  async removeFromCart(itemId: string) {
    if (!process.env.DATABASE_URL || !isValidUuid(itemId)) {
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

  /**
   * Clear all items in user cart.
   */
  async clearCart(userId: string) {
    if (!process.env.DATABASE_URL || !isValidUuid(userId)) {
      return true;
    }
    try {
      const [userCart] = await db
        .select()
        .from(cartTable)
        .where(eq(cartTable.userId, userId))
        .limit(1);

      if (userCart) {
        await db.delete(cartItemsTable).where(eq(cartItemsTable.cartId, userCart.id));
      }
      return true;
    } catch (error) {
      console.warn("Clear cart DB fallback:", (error as Error).message);
      return true;
    }
  },

  /**
   * Synchronize guest localStorage cart items into the user's persistent DB cart on login.
   */
  async syncGuestCart(userId: string, guestItems: any[]) {
    if (!Array.isArray(guestItems) || guestItems.length === 0) {
      return this.getCart(userId);
    }

    for (const gItem of guestItems) {
      const pId = gItem.productId || gItem.id;
      if (pId) {
        await this.addToCart(userId, {
          productId: pId,
          quantity: Number(gItem.quantity) || 1,
          size: gItem.size || "M",
          color: gItem.color,
        });
      }
    }

    return this.getCart(userId);
  },
};

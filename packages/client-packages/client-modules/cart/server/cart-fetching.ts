import { CartItem } from "@/features/cart-slice";
import { CartService } from "@/modules/cart/services/cart-service";

export async function fetchCartSSR(userId: string): Promise<CartItem[]> {
  try {
    const items = await CartService.getCart(userId || "mock-user");
    if (Array.isArray(items) && items.length > 0) {
      return items as unknown as CartItem[];
    }
  } catch (err) {
    console.warn("fetchCartSSR error, falling back to static presentation data:", err);
  }

  return [];
}

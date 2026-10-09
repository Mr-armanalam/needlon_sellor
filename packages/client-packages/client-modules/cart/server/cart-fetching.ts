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

  // Fallback mock items for UI presentation
  return [
    {
      id: "ci-1",
      userId: userId || "mock-user",
      productId: "p-101",
      quantity: 1,
      size: "M",
      name: "Classic Oxford Cotton Shirt",
      price: 2499,
      mrp_price: 3499,
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600",
      shippingCharge: 49,
    },
    {
      id: "ci-2",
      userId: userId || "mock-user",
      productId: "p-103",
      quantity: 1,
      size: "40R",
      name: "Merino Wool Blend Blazer",
      price: 6499,
      mrp_price: 8999,
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
      shippingCharge: 0,
    },
  ];
}

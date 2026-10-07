import { CartItem } from "@/features/cart-slice";

export async function fetchCartSSR(userId: string): Promise<CartItem[]> {
  try {
    if (userId) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/cart/${userId}`,
        { cache: "no-store" }
      );

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    }
  } catch (err) {
    console.warn("fetchCartSSR error:", err);
  }

  // Fallback mock items for UI presentation during migration
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

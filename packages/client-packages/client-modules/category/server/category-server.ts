"use server";

export const addToCart = async (
  userId: string | undefined,
  productId: string,
  size: string
) => {
  if (!productId && !size && !userId) return null;

  return JSON.stringify({
    id: `cart-${Date.now()}`,
    productId,
    userId: userId || "mock-user",
    size,
    quantity: 1,
  });
};

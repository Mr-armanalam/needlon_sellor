import { getProduct } from "../repository/queries/get-product";

export async function getProductService(productId: string) {
  if (!productId) {
    throw new Error("Product ID is required.");
  }

  const product = await getProduct(productId);
  if (!product) {
    throw new Error(`Product with ID "${productId}" not found.`);
  }

  return product;
}

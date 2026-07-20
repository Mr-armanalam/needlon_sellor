import { deleteProduct } from "../repository/commands/delete-product";
import { getProduct } from "../repository/queries/get-product";

export async function deleteProductService(productId: string) {
  const existing = await getProduct(productId);
  if (!existing) {
    throw new Error(`Product with ID "${productId}" not found.`);
  }

  const deleted = await deleteProduct(productId);
  return deleted;
}

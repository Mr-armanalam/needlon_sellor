import { listProducts, ListProductsOptions } from "../repository/queries/list-products";

export async function listProductsService(options: ListProductsOptions) {
  if (!options.sellerId) {
    throw new Error("Seller ID is required to list products.");
  }

  return listProducts(options);
}

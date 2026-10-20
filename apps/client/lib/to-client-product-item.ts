import type { ClientProductItem } from "@/types/product";
import { getProductByType } from "@/modules/shared/product-items/server/get-product-by-type";

export type ProductByTypeItem = Awaited<
  ReturnType<typeof getProductByType>
>[number];

/**
 * Maps a product returned by getProductByType (whose display fields are
 * optional) to the ClientProductItem shape the home sections render,
 * applying the same defaults as the season section.
 */
export function toClientProductItem(
  product: ProductByTypeItem,
): ClientProductItem {
  return {
    id: product.id,
    categoryId: product.categoryId ?? "",
    name: product.name,
    tagName: product.tagName ?? "",
    mrp_price: product.mrp_price,
    price: product.price,
    image: product.image,
    modalImage: product.modalImage,
    sizes: product.sizes,
    quantity: product.quantity ?? 0,
    averageRating: product.averageRating ?? "",
    reviewCount: product.reviewCount ?? 0,
    isPremium: product.isPremium ?? false,
    createdAt: product.createdAt ?? null,
    updatedAt: product.updatedAt ?? null,
  };
}

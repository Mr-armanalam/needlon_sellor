import type { ProductCardViewModel } from "../types";

/**
 * Raw product row consumed by {@link toProductCardViewModel}. Fields other
 * than `id` are optional because list endpoints and callers populate
 * different subsets of them; the mapper falls back for each missing field.
 */
export interface ProductCardSourceItem {
  id: string;
  name?: string | null;
  category?: string | { name?: string | null } | null;
  shortDescription?: string | null;
  subcategory?: string | null;
  price?: string | number | null;
  variants?: Array<{ price?: string | number | null }> | null;
  inventory?: { quantity?: number | null } | null;
  stock?: number | null;
  discount?: string | null;
  views?: number | null;
  likes?: number | null;
  orders?: number | null;
  reviews?: number | null;
  status?: string | null;
  bg?: string | null;
  primaryImage?: string | null;
  imageUrl?: string | null;
}

export function toProductCardViewModel(item: ProductCardSourceItem): ProductCardViewModel {
  const primaryVariant = item.variants?.[0];
  const rawPrice = primaryVariant?.price ?? item.price;
  const priceVal = rawPrice
    ? `₹${Number(rawPrice).toLocaleString()}`
    : "₹0";

  const stockVal = item.inventory?.quantity ?? item.stock ?? 0;
  const initials = item.name
    ? item.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "PD";

  let primaryImg = item.primaryImage || item.imageUrl || null;
  if (primaryImg && typeof primaryImg === "string" && primaryImg.startsWith("blob:")) {
    primaryImg = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600";
  }

  return {
    id: item.id,
    name: item.name || "Untitled Product",
    category: (typeof item.category === "string" ? item.category : item.category?.name) || "Apparel",
    subcategory: item.shortDescription || item.subcategory || "Boutique",
    price: priceVal,
    discount: item.discount || "10% OFF",
    stock: stockVal,
    views: item.views ?? 0,
    likes: item.likes ?? 0,
    orders: item.orders ?? 0,
    rating: item.reviews || 0,
    status: item.status === "PUBLISHED" ? (stockVal > 0 ? "Active" : "Out of Stock") : (item.status || "Draft"),
    bg: item.bg || "bg-orange-50 text-orange-700",
    initials: initials || "CK",
    primaryImage: primaryImg,
  };
}

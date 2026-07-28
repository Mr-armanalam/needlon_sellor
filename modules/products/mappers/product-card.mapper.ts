import type { ProductCardViewModel } from "../types";

export function toProductCardViewModel(item: any): ProductCardViewModel {
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
    category: item.category?.name || item.category || "Apparel",
    subcategory: item.shortDescription || item.subcategory || "Boutique",
    price: priceVal,
    discount: item.discount || "10% OFF",
    stock: stockVal,
    views: item.views ?? 0,
    likes: item.likes ?? 0,
    orders: item.orders ?? 0,
    rating: item.rating || 4.8,
    status: item.status === "PUBLISHED" ? (stockVal > 0 ? "Active" : "Out of Stock") : (item.status || "Draft"),
    bg: item.bg || "bg-orange-50 text-orange-700",
    initials: initials || "CK",
    primaryImage: primaryImg,
  };
}

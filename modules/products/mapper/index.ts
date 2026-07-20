import { ProductCardViewModel } from "../types";

export function toProductCardViewModel(item: any): ProductCardViewModel {
  const primaryVariant = item.variants?.[0];
  const priceVal = primaryVariant?.price ? `₹${Number(primaryVariant.price).toLocaleString()}` : "₹0";
  const stockVal = primaryVariant ? (item.inventory?.quantity ?? 14) : 0;
  const initials = item.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "PD";

  return {
    id: item.id,
    name: item.name,
    category: item.category?.name || "Apparel",
    subcategory: item.shortDescription || "Boutique",
    price: priceVal,
    discount: "10% OFF",
    stock: stockVal,
    views: 120,
    likes: 24,
    orders: 8,
    rating: 4.8,
    status: item.status === "PUBLISHED" ? (stockVal > 0 ? "Active" : "Out of Stock") : "Draft",
    bg: "bg-orange-50 text-orange-700",
    initials,
  };
}

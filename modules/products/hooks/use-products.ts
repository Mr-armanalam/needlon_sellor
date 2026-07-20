'use client'
import { useState, useEffect, useCallback } from "react";
import { fetchProductsClient, deleteProductClient } from "../api/product-client";
import { toProductCardViewModel } from "../mapper";
import { ProductCardViewModel } from "../types";

const INITIAL_PRODUCTS: ProductCardViewModel[] = [
  {
    id: "1",
    name: "Handloom Chikankari Kurti",
    category: "Ethnic Wear",
    subcategory: "Kurtis",
    price: "₹2,450",
    discount: "10% OFF",
    stock: 14,
    views: 520,
    likes: 84,
    orders: 32,
    rating: 4.8,
    status: "Active",
    bg: "bg-orange-50 text-orange-700",
    initials: "CK",
  },
  {
    id: "2",
    name: "Pure Cotton Indigo Shirt",
    category: "Western Wear",
    subcategory: "Casual Shirts",
    price: "₹1,850",
    discount: "5% OFF",
    stock: 0,
    views: 340,
    likes: 41,
    orders: 18,
    rating: 4.5,
    status: "Out of Stock",
    bg: "bg-blue-50 text-blue-700",
    initials: "IS",
  },
];

export function useProducts(activeTab: string = "All", searchQuery: string = "") {
  const [products, setProducts] = useState<ProductCardViewModel[]>(INITIAL_PRODUCTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const json = await fetchProductsClient(activeTab, searchQuery);
      if (json.data?.items && json.data.items.length > 0) {
        const mapped = json.data.items.map(toProductCardViewModel);
        setProducts(mapped);
      }
    } catch (err: any) {
      setError(err.message || "Error loading products");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const removeProduct = async (id: string) => {
    try {
      if (id.includes("-")) {
        await deleteProductClient(id);
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error(err);
    }
  };

  const duplicateProduct = (product: ProductCardViewModel) => {
    setProducts((prev) => [
      ...prev,
      { ...product, id: `copy-${Date.now()}`, name: `${product.name} (Copy)` },
    ]);
  };

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    removeProduct,
    duplicateProduct,
  };
}

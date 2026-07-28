'use client'
import { useState, useEffect, useCallback } from "react";
import { fetchProductsClient, deleteProductClient, duplicateProductClient } from "../api/product-client";
import { toProductCardViewModel } from "../mappers";
import { ProductCardViewModel } from "../types";

const INITIAL_PRODUCTS: ProductCardViewModel[] = [];

export function useProducts(
  activeTab: string = "All",
  searchQuery: string = "",
  category?: string,
  size?: string,
  priceRange?: string,
  stockStatus?: string,
  sort?: string
) {
  const [products, setProducts] = useState<ProductCardViewModel[]>(INITIAL_PRODUCTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const json = await fetchProductsClient(
        activeTab,
        searchQuery,
        category,
        size,
        priceRange,
        stockStatus,
        sort
      );
      if (json.data?.items) {
        const mapped = json.data.items.map(toProductCardViewModel);
        setProducts(mapped);
      } else {
        setProducts([]);
      }
    } catch (err: any) {
      setError(err.message || "Error loading products");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery, category, size, priceRange, stockStatus, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const removeProduct = async (id: string) => {
    try {
      if (id.includes("-")) {
        await deleteProductClient(id);
      }
      await fetchProducts();
    } catch (err: any) {
      console.error("Failed to delete product:", err);
    }
  };

  const duplicateProduct = async (id: string) => {
    try {
      if (id.includes("-")) {
        await duplicateProductClient(id);
      }
      await fetchProducts();
    } catch (err: any) {
      console.error("Failed to duplicate product:", err);
    }
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

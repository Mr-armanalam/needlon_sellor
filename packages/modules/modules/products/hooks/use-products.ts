'use client'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProductsClient, deleteProductClient, duplicateProductClient } from "../api/product-client";
import { toProductCardViewModel } from "../mappers";
import { ProductCardViewModel } from "../types";
import { productKeys } from "../keys";

export function useProducts(
  activeTab: string = "All",
  searchQuery: string = "",
  category?: string,
  size?: string,
  priceRange?: string,
  stockStatus?: string,
  sort?: string
) {
  const queryClient = useQueryClient();

  const filter = { activeTab, searchQuery, category, size, priceRange, stockStatus, sort };
  const queryKey = productKeys.list(filter);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchProductsClient(
      activeTab,
      searchQuery,
      category,
      size,
      priceRange,
      stockStatus,
      sort
    ),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: duplicateProductClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });

  const rawItems = data?.items || [];
  const products: ProductCardViewModel[] = rawItems.map(toProductCardViewModel);

  const removeProduct = async (id: string) => {
    try {
      if (id.includes("-")) {
        await deleteMutation.mutateAsync(id);
      }
    } catch (err: any) {
      console.error("Failed to delete product:", err);
    }
  };

  const duplicateProduct = async (id: string) => {
    try {
      if (id.includes("-")) {
        await duplicateMutation.mutateAsync(id);
      }
    } catch (err: any) {
      console.error("Failed to duplicate product:", err);
    }
  };

  return {
    products,
    isLoading,
    error: error ? error.message : null,
    refetch,
    removeProduct,
    duplicateProduct,
  };
}

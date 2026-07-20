'use client';

import { useState, useEffect, useCallback } from "react";
import { fetchCategoriesClient, deleteCategoryClient } from "../api/category-client";
import { CategoryTreeNode } from "../types";

export function useCategories() {
  const [categories, setCategories] = useState<CategoryTreeNode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const json = await fetchCategoriesClient();
      if (json.data?.tree) {
        setCategories(json.data.tree);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const removeCategory = async (id: string) => {
    try {
      await deleteCategoryClient(id);
      await fetchCategories();
    } catch (err: any) {
      console.error(err);
    }
  };

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
    removeCategory,
  };
}

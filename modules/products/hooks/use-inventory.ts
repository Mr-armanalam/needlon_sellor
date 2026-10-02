import { useState, useEffect, useCallback } from "react";
import { InventoryItemResponseDto } from "../dto/inventory.dto";

export function useInventory(options?: { lowStockOnly?: boolean }) {
  const [items, setItems] = useState<InventoryItemResponseDto[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (options?.lowStockOnly) queryParams.append("lowStockOnly", "true");

      const res = await fetch(`/api/seller/inventory?${queryParams.toString()}`);
      const json = await res.json();

      if (json.success && json.data) {
        setItems(json.data.items || []);
        setLowStockCount(json.data.lowStockCount || 0);
      } else {
        setError(json.error?.message || "Failed to fetch inventory");
      }
    } catch (err: any) {
      setError(err.message || "Network error fetching inventory");
    } finally {
      setLoading(false);
    }
  }, [options?.lowStockOnly]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const updateStock = async (variantId: string, quantity: number, lowStockThreshold?: number) => {
    try {
      const res = await fetch("/api/seller/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity, lowStockThreshold }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchInventory();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const adjustStock = async (variantId: string, adjustment: number, reason?: string) => {
    try {
      const res = await fetch("/api/seller/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, adjustment, reason }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchInventory();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return {
    items,
    lowStockCount,
    loading,
    error,
    refetch: fetchInventory,
    updateStock,
    adjustStock,
  };
}

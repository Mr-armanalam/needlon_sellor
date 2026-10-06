import { useState, useEffect, useCallback } from "react";
import { DashboardOverviewResponseDto } from "../dto/dashboard.dto";

export function useDashboard() {
  const [data, setData] = useState<DashboardOverviewResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingMap, setActionLoadingMap] = useState<Record<string, boolean>>({});

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/seller/dashboard");
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        setError(json.error?.message || "Failed to load dashboard overview");
      }
    } catch (err: any) {
      setError(err.message || "Network error fetching dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const confirmOrder = async (orderId: string) => {
    setActionLoadingMap((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch(`/api/seller/orders/${orderId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CONFIRM" }),
      });
      const json = await res.json();
      if (json.success) {
        // Refetch fresh data
        await fetchDashboard();
        return { success: true };
      }
      return { success: false, message: json.error?.message || "Failed to confirm order" };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error" };
    } finally {
      setActionLoadingMap((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const declineOrder = async (orderId: string) => {
    setActionLoadingMap((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch(`/api/seller/orders/${orderId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CANCEL", remarks: "Declined by seller from dashboard" }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchDashboard();
        return { success: true };
      }
      return { success: false, message: json.error?.message || "Failed to decline order" };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error" };
    } finally {
      setActionLoadingMap((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const duplicateProduct = async (productId: string) => {
    setActionLoadingMap((prev) => ({ ...prev, [`dup-${productId}`]: true }));
    try {
      const res = await fetch(`/api/seller/products/${productId}/duplicate`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        await fetchDashboard();
        return { success: true, product: json.data };
      }
      return { success: false, message: json.error?.message || "Failed to duplicate product" };
    } catch (err: any) {
      return { success: false, message: err.message || "Network error" };
    } finally {
      setActionLoadingMap((prev) => ({ ...prev, [`dup-${productId}`]: false }));
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchDashboard,
    confirmOrder,
    declineOrder,
    duplicateProduct,
    actionLoadingMap,
  };
}

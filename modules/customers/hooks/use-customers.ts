import { useState, useEffect, useCallback } from "react";
import { CustomerItemResponseDto } from "../dto/customer.dto";

export function useCustomers(searchQuery?: string) {
  const [customers, setCustomers] = useState<CustomerItemResponseDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/seller/customers${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        setCustomers(json.data.customers || []);
        setTotalCount(json.data.totalCount || 0);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    totalCount,
    loading,
    error,
    refetch: fetchCustomers,
  };
}

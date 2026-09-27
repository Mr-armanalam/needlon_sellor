import { useState, useEffect, useCallback } from "react";

export interface CustomerHistoryItem {
  id: string;
  orderId: string;
  date: string;
  total: string;
  status: string;
}

export interface CustomerReviewItem {
  id: string;
  rating: number;
  comment: string;
  product: string;
  date: string;
}

export interface CustomerDetailsData {
  history: CustomerHistoryItem[];
  reviews: CustomerReviewItem[];
}

export function useCustomerDetails(buyerId?: string) {
  const [data, setData] = useState<CustomerDetailsData>({ history: [], reviews: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!buyerId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/seller/customers/${buyerId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load customer details";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [buyerId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return {
    data,
    loading,
    error,
    refetch: fetchDetails,
  };
}

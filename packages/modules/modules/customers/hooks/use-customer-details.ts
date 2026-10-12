import { apiFetch } from "@/modules/auth/lib/auth-client";
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

export interface CustomerMeasurementItem {
  id: string;
  orderId?: string | null;
  gender: string;
  garmentType: string;
  unit: string;
  essentialMeasurements: Record<string, any>;
  postureSpecifics: Record<string, any>;
  fitPreference?: string;
  tailorNotes?: string;
  source: string;
  status: string;
  date: string;
}

export interface CustomerDetailsData {
  history: CustomerHistoryItem[];
  reviews: CustomerReviewItem[];
  measurements?: CustomerMeasurementItem[];
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
      const res = await apiFetch(`/api/seller/customers/${buyerId}`);
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

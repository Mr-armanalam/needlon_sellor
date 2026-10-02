import { useState, useEffect, useCallback } from "react";
import { AnalyticsOverviewResponseDto } from "../dto/analytics.dto";

export function useAnalytics(timeframe: "7d" | "30d" | "90d" | "1y" = "30d") {
  const [data, setData] = useState<AnalyticsOverviewResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/seller/analytics/overview?timeframe=${timeframe}`);
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        setError(json.error?.message || "Failed to load analytics data");
      }
    } catch (err: any) {
      setError(err.message || "Network error fetching analytics");
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}

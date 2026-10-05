import { useState, useEffect, useCallback } from "react";

export function useHelpCenter() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [kbArticles, setKbArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<{ articles: any[]; tickets: any[] }>({
    articles: [],
    tickets: [],
  });
  const [isSearching, setIsSearching] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch("/api/seller/help/dashboard");
      const json = await res.json();
      if (json.success && json.data) {
        setDashboardData(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch help dashboard:", err);
    }
  }, []);

  const fetchKbArticles = useCallback(async (category?: string) => {
    setLoading(true);
    try {
      const url = category && category !== "all"
        ? `/api/seller/help/kb?category=${encodeURIComponent(category)}`
        : "/api/seller/help/kb";
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        setKbArticles(json.data.articles || []);
      }
    } catch (err) {
      console.error("Failed to fetch KB articles:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    fetchKbArticles();
  }, [fetchDashboard, fetchKbArticles]);

  const searchHelp = async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ articles: [], tickets: [] });
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/seller/help/search?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSearchResults(json.data);
      }
    } catch (err) {
      console.error("Failed to execute help search:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const requestCallback = async (phoneNumber: string, preferredTimeSlot: string, reason?: string) => {
    try {
      const res = await fetch("/api/seller/help/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, preferredTimeSlot, reason }),
      });
      const json = await res.json();
      if (json.success) {
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error?.message || "Failed to schedule callback" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    dashboardData,
    kbArticles,
    loading,
    searchResults,
    isSearching,
    refetchDashboard: fetchDashboard,
    refetchKb: fetchKbArticles,
    searchHelp,
    requestCallback,
  };
}

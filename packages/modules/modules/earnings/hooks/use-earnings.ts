import { useState, useEffect, useCallback } from "react";
import {
  EarningsSummaryResponseDto,
  EarningsAnalyticsResponseDto,
  LedgerResponseDto,
} from "../dto/finance.dto";

export function useEarnings() {
  const [summary, setSummary] = useState<EarningsSummaryResponseDto | null>(null);
  const [analytics, setAnalytics] = useState<EarningsAnalyticsResponseDto | null>(null);
  const [ledger, setLedger] = useState<LedgerResponseDto | null>(null);
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("weekly");
  const [viewType, setViewType] = useState<"transactions" | "settlements">("transactions");
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch lifetime metrics and bank accounts
  const fetchSummaryAndBank = useCallback(async () => {
    try {
      const [earningsRes, bankRes] = await Promise.all([
        fetch("/api/seller/earnings"),
        fetch("/api/seller/bank"),
      ]);

      const earningsJson = await earningsRes.json();
      const bankJson = await bankRes.json();

      if (earningsJson.success && earningsJson.data) {
        setSummary(earningsJson.data);
      }
      if (bankJson.success && bankJson.data) {
        setBankAccounts(bankJson.data.bankAccounts || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load financial data");
    }
  }, []);

  // 2. Fetch analytics when timeframe changes
  const fetchAnalytics = useCallback(async (tf: "weekly" | "monthly") => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/seller/earnings/analytics?timeframe=${tf}`);
      const json = await res.json();
      if (json.success && json.data) {
        setAnalytics(json.data);
      }
    } catch (err: any) {
      console.error("Failed to load analytics:", err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  // 3. Fetch ledger when viewType changes
  const fetchLedger = useCallback(async (vt: "transactions" | "settlements") => {
    setLedgerLoading(true);
    try {
      const res = await fetch(`/api/seller/earnings/ledger?viewType=${vt}`);
      const json = await res.json();
      if (json.success && json.data) {
        setLedger(json.data);
      }
    } catch (err: any) {
      console.error("Failed to load ledger:", err);
    } finally {
      setLedgerLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([
        fetchSummaryAndBank(),
        fetchAnalytics(timeframe),
        fetchLedger(viewType),
      ]);
      setLoading(false);
    };
    init();
  }, [fetchSummaryAndBank, fetchAnalytics, fetchLedger]);

  // Handle timeframe change
  const handleTimeframeChange = (tf: "weekly" | "monthly") => {
    setTimeframe(tf);
    fetchAnalytics(tf);
  };

  // Handle viewType change
  const handleViewTypeChange = (vt: "transactions" | "settlements") => {
    setViewType(vt);
    fetchLedger(vt);
  };

  // 4. Request payout mutation
  const requestPayout = async (amount: number, bankAccountId?: string, notes?: string) => {
    try {
      const res = await fetch("/api/seller/payouts/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, bankAccountId, notes }),
      });
      const json = await res.json();
      if (json.success) {
        // Refetch both summary and settlements to reflect the immediate withdrawal
        await Promise.all([
          fetchSummaryAndBank(),
          fetchLedger(viewType),
        ]);
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error?.message || "Payout request failed" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // 5. Export CSV handler
  const exportCsv = () => {
    window.open(`/api/seller/earnings/export?viewType=${viewType}`, "_blank");
  };

  return {
    summary,
    analytics,
    ledger,
    timeframe,
    viewType,
    bankAccounts,
    loading,
    analyticsLoading,
    ledgerLoading,
    error,
    setTimeframe: handleTimeframeChange,
    setViewType: handleViewTypeChange,
    requestPayout,
    exportCsv,
    refetch: async () => {
      await Promise.all([
        fetchSummaryAndBank(),
        fetchAnalytics(timeframe),
        fetchLedger(viewType),
      ]);
    },
  };
}

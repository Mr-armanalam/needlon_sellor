import { useState, useEffect, useCallback } from "react";
import { EarningsSummaryResponseDto } from "../dto/finance.dto";

export function useEarnings() {
  const [summary, setSummary] = useState<EarningsSummaryResponseDto | null>(null);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEarningsData = useCallback(async () => {
    setLoading(true);
    setError(null);
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEarningsData();
  }, [fetchEarningsData]);

  const requestPayout = async (amount: number, bankAccountId?: string) => {
    try {
      const res = await fetch("/api/seller/payouts/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, bankAccountId }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchEarningsData();
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error?.message || "Payout request failed" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateBankAccount = async (bankData: any) => {
    try {
      const res = await fetch("/api/seller/bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bankData),
      });
      const json = await res.json();
      if (json.success) {
        await fetchEarningsData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return {
    summary,
    bankAccounts,
    loading,
    error,
    refetch: fetchEarningsData,
    requestPayout,
    updateBankAccount,
  };
}

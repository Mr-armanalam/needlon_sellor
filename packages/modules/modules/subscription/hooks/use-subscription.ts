import { useState, useEffect, useCallback } from "react";
import {
  SubscriptionPlanDto,
  SellerSubscriptionResponseDto,
  BillingLedgerResponseDto,
} from "../dto/subscription.dto";

export function useSubscription() {
  const [plans, setPlans] = useState<SubscriptionPlanDto[]>([]);
  const [subscription, setSubscription] = useState<SellerSubscriptionResponseDto | null>(null);
  const [ledger, setLedger] = useState<BillingLedgerResponseDto | null>(null);
  const [ledgerTab, setLedgerTab] = useState<"history" | "invoices">("history");
  const [loading, setLoading] = useState(true);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionData = useCallback(async () => {
    try {
      const res = await fetch("/api/seller/subscription");
      const json = await res.json();
      if (json.success && json.data) {
        setPlans(json.data.plans || []);
        setSubscription(json.data.subscription || null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load subscription data");
    }
  }, []);

  const fetchLedger = useCallback(async (tab: "history" | "invoices") => {
    setLedgerLoading(true);
    try {
      const res = await fetch(`/api/seller/subscription/ledger?tab=${tab}`);
      const json = await res.json();
      if (json.success && json.data) {
        setLedger(json.data);
      }
    } catch (err: any) {
      console.error("Failed to load billing ledger:", err);
    } finally {
      setLedgerLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchSubscriptionData(), fetchLedger(ledgerTab)]);
      setLoading(false);
    };
    init();
  }, [fetchSubscriptionData, fetchLedger]);

  const handleTabChange = (tab: "history" | "invoices") => {
    setLedgerTab(tab);
    fetchLedger(tab);
  };

  const updatePlan = async (
    planId: string,
    billingCycle: "MONTHLY" | "YEARLY" = "MONTHLY",
    paymentDetails?: {
      cardLast4?: string;
      cardBrand?: string;
      cardholderName?: string;
      gatewayToken?: string;
    }
  ) => {
    try {
      const res = await fetch("/api/seller/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingCycle, paymentDetails }),
      });
      const json = await res.json();
      if (json.success) {
        await Promise.all([fetchSubscriptionData(), fetchLedger(ledgerTab)]);
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error?.message || "Failed to update plan" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const downloadInvoice = (invoiceId: string) => {
    window.open(`/api/seller/subscription/invoices/${encodeURIComponent(invoiceId)}/download`, "_blank");
  };

  return {
    plans,
    subscription,
    ledger,
    ledgerTab,
    loading,
    ledgerLoading,
    error,
    setLedgerTab: handleTabChange,
    refetch: async () => {
      await Promise.all([fetchSubscriptionData(), fetchLedger(ledgerTab)]);
    },
    updatePlan,
    downloadInvoice,
  };
}

import { useState, useEffect, useCallback } from "react";
import { SubscriptionPlanDto, SellerSubscriptionResponseDto } from "../dto/subscription.dto";

export function useSubscription() {
  const [plans, setPlans] = useState<SubscriptionPlanDto[]>([]);
  const [subscription, setSubscription] = useState<SellerSubscriptionResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/seller/subscription");
      const json = await res.json();
      if (json.success && json.data) {
        setPlans(json.data.plans || []);
        setSubscription(json.data.subscription || null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load subscription data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  const updatePlan = async (planId: string, billingCycle: "MONTHLY" | "YEARLY" = "MONTHLY") => {
    try {
      const res = await fetch("/api/seller/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingCycle }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchSubscriptionData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return {
    plans,
    subscription,
    loading,
    error,
    refetch: fetchSubscriptionData,
    updatePlan,
  };
}

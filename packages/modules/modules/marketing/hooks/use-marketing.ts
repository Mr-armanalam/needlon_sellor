import { useState, useEffect, useCallback } from "react";
import { CouponItemDto, CampaignItemDto, ReferralInfoDto, CreateCouponDto, CreateCampaignDto, CreateReferralDto } from "../dto/marketing.dto";

export function useCoupons() {
  const [coupons, setCoupons] = useState<CouponItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/seller/marketing/coupons");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCoupons(json.data);
      } else {
        setError(json.error?.message || "Failed to load coupons");
      }
    } catch (err: any) {
      setError(err.message || "Network error loading coupons");
    } finally {
      setLoading(false);
    }
  }, []);

  const createCoupon = async (dto: CreateCouponDto) => {
    const res = await fetch("/api/seller/marketing/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || "Failed to create coupon");
    await fetchCoupons();
    return json.data;
  };

  const deleteCoupon = async (id: string) => {
    const res = await fetch(`/api/seller/marketing/coupons?id=${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || "Failed to delete coupon");
    await fetchCoupons();
  };

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return { coupons, loading, error, fetchCoupons, createCoupon, deleteCoupon };
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<CampaignItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/seller/marketing/campaigns");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCampaigns(json.data);
      } else {
        setError(json.error?.message || "Failed to load campaigns");
      }
    } catch (err: any) {
      setError(err.message || "Network error loading campaigns");
    } finally {
      setLoading(false);
    }
  }, []);

  const createCampaign = async (dto: CreateCampaignDto) => {
    const res = await fetch("/api/seller/marketing/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || "Failed to create campaign");
    await fetchCampaigns();
    return json.data;
  };

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return { campaigns, loading, error, fetchCampaigns, createCampaign };
}

export function useReferrals() {
  const [referral, setReferral] = useState<ReferralInfoDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReferrals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/seller/marketing/referrals");
      const json = await res.json();
      if (json.success && json.data) {
        setReferral(json.data);
      } else {
        setError(json.error?.message || "Failed to load referral program");
      }
    } catch (err: any) {
      setError(err.message || "Network error loading referral program");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReferral = async (dto: CreateReferralDto) => {
    const res = await fetch("/api/seller/marketing/referrals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || "Failed to update referral program");
    await fetchReferrals();
    return json.data;
  };

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  return { referral, loading, error, fetchReferrals, updateReferral };
}

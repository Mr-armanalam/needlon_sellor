import { z } from "zod";

// --- Coupons DTOs ---
export const createCouponSchema = z.object({
  name: z.string().min(2, "Coupon name must be at least 2 characters").max(150),
  couponCode: z.string().min(3, "Code must be at least 3 characters").max(50),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountValue: z.number().positive("Discount value must be positive"),
  minimumOrderAmount: z.number().min(0).optional(),
  maximumDiscountAmount: z.number().min(0).optional(),
  usageLimit: z.number().int().positive().optional(),
  usagePerBuyer: z.number().int().positive().default(1),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

export type CreateCouponDto = z.infer<typeof createCouponSchema>;

export interface CouponItemDto {
  id: string;
  name: string;
  couponCode: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: string;
  minimumOrderAmount: string | null;
  maximumDiscountAmount: string | null;
  usageLimit: number | null;
  totalRedemptions: number;
  status: string;
  startsAt: string;
  endsAt: string;
}

// --- Campaigns DTOs ---
export const createCampaignSchema = z.object({
  name: z.string().min(2, "Campaign name must be at least 2 characters").max(150),
  description: z.string().optional(),
  channel: z.enum(["WHATSAPP", "INSTAGRAM", "GOOGLE", "EMAIL", "CUSTOM"]).default("CUSTOM"),
  targetUrl: z.string().optional(),
  budget: z.number().min(0).optional(),
});

export type CreateCampaignDto = z.infer<typeof createCampaignSchema>;

export interface CampaignItemDto {
  id: string;
  name: string;
  channel: string;
  reach: string;
  conversions: string;
  trend: string;
  status: "Active" | "Paused" | "Completed";
  createdAt: string;
}

// --- Referral DTOs ---
export const createReferralSchema = z.object({
  campaignName: z.string().min(2).default("STORE_REFERRAL"),
  referralCode: z.string().min(3).max(30),
  description: z.string().optional(),
  maxUsageLimit: z.number().int().positive().optional(),
});

export type CreateReferralDto = z.infer<typeof createReferralSchema>;

export interface ReferralInfoDto {
  referralCode: string;
  shareUrl: string;
  totalReferrals: number;
  rewardsEarned: string;
  status: string;
}

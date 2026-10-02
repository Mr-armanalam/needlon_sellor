import { z } from "zod";

export const updateSubscriptionSchema = z.object({
  planId: z.string().uuid("Invalid plan ID"),
  billingCycle: z.enum(["MONTHLY", "YEARLY"]).default("MONTHLY"),
});

export type UpdateSubscriptionDto = z.infer<typeof updateSubscriptionSchema>;

export interface SubscriptionPlanDto {
  id: string;
  name: string;
  code: string;
  priceMonthly: string;
  priceYearly: string;
  maxProducts: number;
  commissionRatePercent: number;
  features: string[];
}

export interface SellerSubscriptionResponseDto {
  id: string;
  planName: string;
  status: string;
  price: string;
  billingType: string;
  currentPeriodEnd: string;
  autoRenew: boolean;
}

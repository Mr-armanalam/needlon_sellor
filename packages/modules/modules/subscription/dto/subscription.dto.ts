import { z } from "zod";

export const updateSubscriptionSchema = z.object({
  planId: z.string().uuid("Invalid plan ID"),
  billingCycle: z.enum(["MONTHLY", "YEARLY"]).default("MONTHLY"),
  paymentDetails: z
    .object({
      cardLast4: z.string().optional(),
      cardBrand: z.string().optional(),
      cardholderName: z.string().optional(),
      gatewayToken: z.string().optional(),
    })
    .optional(),
});

export const billingLedgerQuerySchema = z.object({
  tab: z.enum(["history", "invoices"]).default("history"),
});

export type UpdateSubscriptionDto = z.infer<typeof updateSubscriptionSchema>;
export type BillingLedgerQueryDto = z.infer<typeof billingLedgerQuerySchema>;

export interface SubscriptionPlanDto {
  id: string;
  name: string;
  code: string;
  description: string;
  priceMonthly: string;
  priceYearly: string;
  currencyCode: string;
  isPopular: boolean;
  features: string[];
}

export interface SellerSubscriptionResponseDto {
  id: string;
  planId: string;
  planCode: string;
  planName: string;
  status: string;
  price: string;
  billingType: string;
  currentPeriodEnd: string;
  autoRenew: boolean;
  benefits: string[];
}

export interface BillingPaymentItemDto {
  id: string;
  date: string;
  method: string;
  total: string;
  status: string;
  invoiceId?: string;
}

export interface BillingInvoiceItemDto {
  id: string;
  date: string;
  period: string;
  total: string;
  status: string;
  invoiceId: string;
}

export interface BillingLedgerResponseDto {
  tab: "history" | "invoices";
  items: (BillingPaymentItemDto | BillingInvoiceItemDto)[];
}

import { z } from "zod";

export const updateBankAccountSchema = z.object({
  accountHolderName: z.string().min(1, "Account holder name is required"),
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(8, "Account number must be at least 8 digits"),
  ifscCode: z.string().min(4, "IFSC code is required"),
  branchName: z.string().optional(),
  accountType: z.enum(["SAVINGS", "CURRENT", "NRE", "NRO", "BUSINESS"]).default("SAVINGS"),
  upiId: z.string().optional(),
});

export const requestPayoutSchema = z.object({
  amount: z.number().min(100, "Minimum payout request is ₹100"),
  bankAccountId: z.string().uuid("Invalid bank account ID").optional(),
  notes: z.string().optional(),
});

export const earningsAnalyticsQuerySchema = z.object({
  timeframe: z.enum(["weekly", "monthly"]).default("weekly"),
});

export const ledgerQuerySchema = z.object({
  viewType: z.enum(["transactions", "settlements"]).default("transactions"),
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(20).optional(),
});

export const exportLedgerQuerySchema = z.object({
  viewType: z.enum(["transactions", "settlements"]).default("transactions"),
});

export type UpdateBankAccountDto = z.infer<typeof updateBankAccountSchema>;
export type RequestPayoutDto = z.infer<typeof requestPayoutSchema>;
export type EarningsAnalyticsQueryDto = z.infer<typeof earningsAnalyticsQuerySchema>;
export type LedgerQueryDto = z.infer<typeof ledgerQuerySchema>;
export type ExportLedgerQueryDto = z.infer<typeof exportLedgerQuerySchema>;

export interface EarningsSummaryResponseDto {
  grossSales: string;
  commissionFees: string;
  netRevenue: string;
  availablePayoutBalance: string;
  pendingBalance: string;
  totalWithdrawn: string;
  monthOverMonthGrowth: number;
  isGrowthPositive: boolean;
}

export interface AnalyticsBarItemDto {
  label: string;
  amount: number;
  formattedAmount: string;
  heightPercentage: number;
}

export interface IncomeBreakdownItemDto {
  label: string;
  amount: string;
  percentage: string;
  rawAmount: number;
}

export interface EarningsAnalyticsResponseDto {
  timeframe: "weekly" | "monthly";
  bars: AnalyticsBarItemDto[];
  channelBreakdown: IncomeBreakdownItemDto[];
}

export interface LedgerItemDto {
  id: string;
  date: string;
  desc: string;
  amount: string;
  type: "credit" | "debit" | "settled";
  status?: string;
  referenceNumber?: string;
}

export interface LedgerResponseDto {
  viewType: "transactions" | "settlements";
  items: LedgerItemDto[];
  totalCount: number;
}

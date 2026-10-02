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

export type UpdateBankAccountDto = z.infer<typeof updateBankAccountSchema>;
export type RequestPayoutDto = z.infer<typeof requestPayoutSchema>;

export interface EarningsSummaryResponseDto {
  grossSales: string;
  commissionFees: string;
  netRevenue: string;
  availablePayoutBalance: string;
  pendingBalance: string;
  totalWithdrawn: string;
}

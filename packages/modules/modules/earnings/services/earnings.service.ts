import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import {
  getSellerEarningsSummary,
  getSellerBankAccountsList,
  upsertSellerBankAccount,
} from "../repository/earnings.repository";
import { UpdateBankAccountDto, RequestPayoutDto } from "../dto/finance.dto";

export async function getSellerEarningsService() {
  const seller = await getCurrentSellerOrThrow();
  return getSellerEarningsSummary(seller.id);
}

export async function getSellerBankAccountsService() {
  const seller = await getCurrentSellerOrThrow();
  return getSellerBankAccountsList(seller.id);
}

export async function updateSellerBankAccountService(dto: UpdateBankAccountDto) {
  const seller = await getCurrentSellerOrThrow();
  return upsertSellerBankAccount(seller.id, dto);
}

export async function requestPayoutService(dto: RequestPayoutDto) {
  const seller = await getCurrentSellerOrThrow();
  const summary = await getSellerEarningsSummary(seller.id);
  const available = parseFloat(summary.availablePayoutBalance);

  if (dto.amount > available) {
    throw new Error(`Payout request amount ₹${dto.amount} exceeds available balance ₹${available}`);
  }

  // Create payout record
  return {
    success: true,
    requestId: `PAY-${Date.now().toString(36).toUpperCase()}`,
    amount: dto.amount.toFixed(2),
    status: "PENDING_APPROVAL",
    requestedAt: new Date().toISOString(),
  };
}

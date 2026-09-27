import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import {
  getSellerEarningsSummary,
  getSellerBankAccountsList,
  upsertSellerBankAccount,
} from "../repository/earnings.repository";
import { UpdateBankAccountDto, RequestPayoutDto } from "../dto/finance.dto";

export async function getSellerEarningsService() {
  const seller = await getCurrentSeller();
  return getSellerEarningsSummary(seller.id);
}

export async function getSellerBankAccountsService() {
  const seller = await getCurrentSeller();
  return getSellerBankAccountsList(seller.id);
}

export async function updateSellerBankAccountService(dto: UpdateBankAccountDto) {
  const seller = await getCurrentSeller();
  return upsertSellerBankAccount(seller.id, dto);
}

export async function requestPayoutService(dto: RequestPayoutDto) {
  const seller = await getCurrentSeller();
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

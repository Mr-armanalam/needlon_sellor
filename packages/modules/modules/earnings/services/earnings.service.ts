import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import {
  getSellerEarningsSummary,
  getEarningsAnalytics,
  getLedgerRecords,
  createSellerPayoutRequest,
  getSellerBankAccountsList,
  upsertSellerBankAccount,
} from "../repository/earnings.repository";
import {
  UpdateBankAccountDto,
  RequestPayoutDto,
  EarningsAnalyticsQueryDto,
  LedgerQueryDto,
  ExportLedgerQueryDto,
} from "../dto/finance.dto";

export async function getSellerEarningsService() {
  const seller = await getCurrentSellerOrThrow();
  return getSellerEarningsSummary(seller.id);
}

export async function getEarningsAnalyticsService(dto: EarningsAnalyticsQueryDto) {
  const seller = await getCurrentSellerOrThrow();
  return getEarningsAnalytics(seller.id, dto.timeframe);
}

export async function getLedgerRecordsService(dto: LedgerQueryDto) {
  const seller = await getCurrentSellerOrThrow();
  return getLedgerRecords(seller.id, dto.viewType);
}

export async function requestPayoutService(dto: RequestPayoutDto) {
  const seller = await getCurrentSellerOrThrow();
  return createSellerPayoutRequest(seller.id, dto);
}

export async function exportLedgerCsvService(dto: ExportLedgerQueryDto) {
  const seller = await getCurrentSellerOrThrow();
  const ledger = await getLedgerRecords(seller.id, dto.viewType);

  // Generate RFC 4180 CSV
  const headers = ["Reference ID", "Date", "Description", "Amount", "Status"];
  const rows = ledger.items.map((item) => [
    `"${(item.id || "").replace(/"/g, '""')}"`,
    `"${(item.date || "").replace(/"/g, '""')}"`,
    `"${(item.desc || "").replace(/"/g, '""')}"`,
    `"${(item.amount || "").replace(/"/g, '""')}"`,
    `"${(item.status || "COMPLETED").replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  return {
    filename: `needlon_${dto.viewType}_${new Date().toISOString().slice(0, 10)}.csv`,
    content: csvContent,
  };
}

export async function getSellerBankAccountsService() {
  const seller = await getCurrentSellerOrThrow();
  return getSellerBankAccountsList(seller.id);
}

export async function updateSellerBankAccountService(dto: UpdateBankAccountDto) {
  const seller = await getCurrentSellerOrThrow();
  return upsertSellerBankAccount(seller.id, dto);
}

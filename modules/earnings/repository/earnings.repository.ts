import { db } from "@/db";
import { orders } from "@/db/schema/orders/table";
import { sellerBankAccounts } from "@/db/schema/seller/seller-bank-account";
import { sellerPayoutMethods } from "@/db/schema/seller/seller-payout-method";
import { and, eq, isNull, sql } from "drizzle-orm";
import { UpdateBankAccountDto, RequestPayoutDto } from "../dto/finance.dto";

export async function getSellerEarningsSummary(sellerId: string) {
  // Aggregate sales totals for completed orders
  const [salesAgg] = await db
    .select({
      totalGross: sql<string>`COALESCE(SUM(${orders.grandTotal}), 0)`,
      completedGross: sql<string>`COALESCE(SUM(CASE WHEN ${orders.status} IN ('DELIVERED', 'COMPLETED') THEN ${orders.grandTotal} ELSE 0 END), 0)`,
      pendingGross: sql<string>`COALESCE(SUM(CASE WHEN ${orders.status} IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'READY_TO_SHIP', 'SHIPPED', 'OUT_FOR_DELIVERY') THEN ${orders.grandTotal} ELSE 0 END), 0)`,
    })
    .from(orders)
    .where(and(eq(orders.sellerId, sellerId), isNull(orders.deletedAt)));

  const grossSalesNum = parseFloat(salesAgg?.completedGross || "0");
  const commissionRate = 0.05; // 5% marketplace commission
  const commissionFeesNum = grossSalesNum * commissionRate;
  const netRevenueNum = grossSalesNum - commissionFeesNum;

  return {
    grossSales: grossSalesNum.toFixed(2),
    commissionFees: commissionFeesNum.toFixed(2),
    netRevenue: netRevenueNum.toFixed(2),
    availablePayoutBalance: netRevenueNum.toFixed(2),
    pendingBalance: parseFloat(salesAgg?.pendingGross || "0").toFixed(2),
    totalWithdrawn: "0.00",
  };
}

export async function getSellerBankAccountsList(sellerId: string) {
  return db
    .select()
    .from(sellerBankAccounts)
    .where(and(eq(sellerBankAccounts.sellerId, sellerId), isNull(sellerBankAccounts.deletedAt)));
}

export async function upsertSellerBankAccount(sellerId: string, dto: UpdateBankAccountDto) {
  const last4 = dto.accountNumber.slice(-4);
  const existing = await db
    .select()
    .from(sellerBankAccounts)
    .where(and(eq(sellerBankAccounts.sellerId, sellerId), isNull(sellerBankAccounts.deletedAt)))
    .limit(1);

  if (existing.length > 0) {
    const [updated] = await db
      .update(sellerBankAccounts)
      .set({
        accountHolderName: dto.accountHolderName,
        bankName: dto.bankName,
        accountNumber: dto.accountNumber, // encrypted/stored
        accountNumberLast4: last4,
        ifscCode: dto.ifscCode,
        branchName: dto.branchName,
        accountType: dto.accountType,
        upiId: dto.upiId,
        updatedAt: new Date(),
      })
      .where(eq(sellerBankAccounts.id, existing[0].id))
      .returning();
    return updated;
  } else {
    const [inserted] = await db
      .insert(sellerBankAccounts)
      .values({
        sellerId,
        accountHolderName: dto.accountHolderName,
        bankName: dto.bankName,
        accountNumber: dto.accountNumber,
        accountNumberLast4: last4,
        ifscCode: dto.ifscCode,
        branchName: dto.branchName,
        accountType: dto.accountType,
        upiId: dto.upiId,
        isPrimary: true,
      })
      .returning();
    return inserted;
  }
}

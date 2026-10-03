import { db } from "@/db";
import { orders } from "@/db/schema/orders/table";
import { sellerBankAccounts } from "@/db/schema/seller/seller-bank-account";
import { sellerPayoutRequests } from "@/db/schema/seller/seller-payout-request";
import { and, desc, eq, gte, isNull, lt, sql } from "drizzle-orm";
import {
  UpdateBankAccountDto,
  RequestPayoutDto,
  EarningsSummaryResponseDto,
  EarningsAnalyticsResponseDto,
  LedgerItemDto,
  LedgerResponseDto,
} from "../dto/finance.dto";
import { PayoutGatewayService } from "../services/payout-gateway.service";

export async function getSellerEarningsSummary(
  sellerId: string
): Promise<EarningsSummaryResponseDto> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // 1. Lifetime sales aggregation
  const [salesAgg] = await db
    .select({
      totalGross: sql<string>`COALESCE(SUM(${orders.grandTotal}), 0)`,
      completedGross: sql<string>`COALESCE(SUM(CASE WHEN ${orders.status} IN ('DELIVERED', 'COMPLETED') THEN ${orders.grandTotal} ELSE 0 END), 0)`,
      pendingGross: sql<string>`COALESCE(SUM(CASE WHEN ${orders.status} IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'READY_TO_SHIP', 'SHIPPED', 'OUT_FOR_DELIVERY') THEN ${orders.grandTotal} ELSE 0 END), 0)`,
      currentMonthGross: sql<string>`COALESCE(SUM(CASE WHEN ${orders.status} IN ('DELIVERED', 'COMPLETED') AND ${orders.createdAt} >= ${thirtyDaysAgo} THEN ${orders.grandTotal} ELSE 0 END), 0)`,
      prevMonthGross: sql<string>`COALESCE(SUM(CASE WHEN ${orders.status} IN ('DELIVERED', 'COMPLETED') AND ${orders.createdAt} >= ${sixtyDaysAgo} AND ${orders.createdAt} < ${thirtyDaysAgo} THEN ${orders.grandTotal} ELSE 0 END), 0)`,
    })
    .from(orders)
    .where(and(eq(orders.sellerId, sellerId), isNull(orders.deletedAt)));

  // 2. Aggregation of settled and pending payouts
  const [payoutAgg] = await db
    .select({
      totalWithdrawn: sql<string>`COALESCE(SUM(CASE WHEN ${sellerPayoutRequests.status} = 'COMPLETED' THEN ${sellerPayoutRequests.amount} ELSE 0 END), 0)`,
      pendingWithdrawn: sql<string>`COALESCE(SUM(CASE WHEN ${sellerPayoutRequests.status} IN ('PENDING', 'PROCESSING') THEN ${sellerPayoutRequests.amount} ELSE 0 END), 0)`,
    })
    .from(sellerPayoutRequests)
    .where(
      and(
        eq(sellerPayoutRequests.sellerId, sellerId),
        isNull(sellerPayoutRequests.deletedAt)
      )
    );

  const grossSalesNum = parseFloat(salesAgg?.completedGross || "0");
  const commissionRate = 0.05; // 5% marketplace commission
  const commissionFeesNum = grossSalesNum * commissionRate;
  const netRevenueNum = grossSalesNum - commissionFeesNum;

  const totalWithdrawnNum = parseFloat(payoutAgg?.totalWithdrawn || "0");
  const pendingWithdrawnNum = parseFloat(payoutAgg?.pendingWithdrawn || "0");

  const availablePayoutBalanceNum = Math.max(
    0,
    netRevenueNum - totalWithdrawnNum - pendingWithdrawnNum
  );

  // Month over month growth calculation
  const currentMonthNum = parseFloat(salesAgg?.currentMonthGross || "0");
  const prevMonthNum = parseFloat(salesAgg?.prevMonthGross || "0");
  let growthPercent = 0;
  if (prevMonthNum > 0) {
    growthPercent = ((currentMonthNum - prevMonthNum) / prevMonthNum) * 100;
  } else if (currentMonthNum > 0) {
    growthPercent = 100;
  }

  return {
    grossSales: grossSalesNum.toFixed(2),
    commissionFees: commissionFeesNum.toFixed(2),
    netRevenue: netRevenueNum.toFixed(2),
    availablePayoutBalance: availablePayoutBalanceNum.toFixed(2),
    pendingBalance: parseFloat(salesAgg?.pendingGross || "0").toFixed(2),
    totalWithdrawn: totalWithdrawnNum.toFixed(2),
    monthOverMonthGrowth: parseFloat(growthPercent.toFixed(1)),
    isGrowthPositive: growthPercent >= 0,
  };
}

export async function getEarningsAnalytics(
  sellerId: string,
  timeframe: "weekly" | "monthly"
): Promise<EarningsAnalyticsResponseDto> {
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
  const monthLabels = [
    "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"
  ];

  let bars: { label: string; amount: number; formattedAmount: string; heightPercentage: number }[] = [];

  if (timeframe === "weekly") {
    // Current week starting Monday
    const now = new Date();
    const currentDay = (now.getDay() + 6) % 7; // Monday = 0, Sunday = 6
    const monday = new Date(now);
    monday.setDate(now.getDate() - currentDay);
    monday.setHours(0, 0, 0, 0);

    const weeklyOrders = await db
      .select({
        dayOfWeek: sql<number>`EXTRACT(DOW FROM ${orders.createdAt})::int`,
        totalSales: sql<string>`COALESCE(SUM(${orders.grandTotal}), 0)`,
      })
      .from(orders)
      .where(
        and(
          eq(orders.sellerId, sellerId),
          gte(orders.createdAt, monday),
          isNull(orders.deletedAt)
        )
      )
      .groupBy(sql`EXTRACT(DOW FROM ${orders.createdAt})`);

    const dailyMap: Record<number, number> = {};
    weeklyOrders.forEach((row) => {
      // DOW: 0 is Sun, 1 is Mon ... 6 is Sat -> map to Mon=0..Sun=6
      const mappedIndex = (row.dayOfWeek + 6) % 7;
      dailyMap[mappedIndex] = parseFloat(row.totalSales || "0");
    });

    const amounts = dayLabels.map((_, i) => dailyMap[i] || 0);
    const maxAmount = Math.max(...amounts, 1);

    bars = dayLabels.map((label, idx) => {
      const amt = amounts[idx];
      return {
        label,
        amount: amt,
        formattedAmount: `₹${amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
        heightPercentage: Math.max(12, Math.round((amt / maxAmount) * 100)),
      };
    });
  } else {
    // Monthly View: 12 months of current year
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);

    const monthlyOrders = await db
      .select({
        monthNumber: sql<number>`EXTRACT(MONTH FROM ${orders.createdAt})::int`,
        totalSales: sql<string>`COALESCE(SUM(${orders.grandTotal}), 0)`,
      })
      .from(orders)
      .where(
        and(
          eq(orders.sellerId, sellerId),
          gte(orders.createdAt, startOfYear),
          isNull(orders.deletedAt)
        )
      )
      .groupBy(sql`EXTRACT(MONTH FROM ${orders.createdAt})`);

    const monthMap: Record<number, number> = {};
    monthlyOrders.forEach((row) => {
      monthMap[row.monthNumber] = parseFloat(row.totalSales || "0");
    });

    const amounts = monthLabels.map((_, i) => monthMap[i + 1] || 0);
    const maxAmount = Math.max(...amounts, 1);

    bars = monthLabels.map((label, idx) => {
      const amt = amounts[idx];
      return {
        label,
        amount: amt,
        formattedAmount: `₹${amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
        heightPercentage: Math.max(12, Math.round((amt / maxAmount) * 100)),
      };
    });
  }

  // Channel breakdown calculated dynamically from real orders
  const channelData = await db
    .select({
      source: orders.source,
      paymentMethod: orders.paymentMethod,
      totalSales: sql<string>`COALESCE(SUM(${orders.grandTotal}), 0)`,
    })
    .from(orders)
    .where(
      and(
        eq(orders.sellerId, sellerId),
        isNull(orders.deletedAt)
      )
    )
    .groupBy(orders.source, orders.paymentMethod);

  let directStorefront = 0;
  let customOrders = 0;
  let reordersSub = 0;

  channelData.forEach((item) => {
    const amt = parseFloat(item.totalSales || "0");
    if (item.source === "WEB" || item.source === "IOS") {
      directStorefront += amt;
    } else if (item.source === "ANDROID" || item.paymentMethod === "COD") {
      customOrders += amt;
    } else {
      reordersSub += amt;
    }
  });

  const grandSum = directStorefront + customOrders + reordersSub || 1;
  const channelBreakdown = [
    {
      label: "Direct Storefront Sales",
      rawAmount: directStorefront,
      amount: `₹${directStorefront.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      percentage: `${Math.round((directStorefront / grandSum) * 100)}%`,
    },
    {
      label: "Custom Configuration Orders",
      rawAmount: customOrders,
      amount: `₹${customOrders.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      percentage: `${Math.round((customOrders / grandSum) * 100)}%`,
    },
    {
      label: "Re-orders & Subscriptions",
      rawAmount: reordersSub,
      amount: `₹${reordersSub.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      percentage: `${Math.round((reordersSub / grandSum) * 100)}%`,
    },
  ];

  return {
    timeframe,
    bars,
    channelBreakdown,
  };
}

export async function getLedgerRecords(
  sellerId: string,
  viewType: "transactions" | "settlements"
): Promise<LedgerResponseDto> {
  if (viewType === "transactions") {
    const orderRows = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        grandTotal: orders.grandTotal,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(and(eq(orders.sellerId, sellerId), isNull(orders.deletedAt)))
      .orderBy(desc(orders.createdAt))
      .limit(50);

    const items: LedgerItemDto[] = orderRows.map((r) => {
      const net = (parseFloat(r.grandTotal || "0") * 0.95).toFixed(2);
      const isDelivered = r.status === "DELIVERED" || r.status === "COMPLETED";
      return {
        id: `TXN-${r.orderNumber.replace(/[^0-9]/g, "").slice(-4) || "1024"}`,
        referenceNumber: r.orderNumber,
        date: r.createdAt
          ? new Intl.DateTimeFormat("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }).format(new Date(r.createdAt))
          : "Recent",
        desc: `Payment for ORD-${r.orderNumber}`,
        amount: `+₹${net}`,
        type: "credit",
        status: r.status,
      };
    });

    return {
      viewType: "transactions",
      items,
      totalCount: items.length,
    };
  } else {
    // Settlements view from sellerPayoutRequests
    const payoutRows = await db
      .select({
        id: sellerPayoutRequests.id,
        payoutNumber: sellerPayoutRequests.payoutNumber,
        amount: sellerPayoutRequests.amount,
        status: sellerPayoutRequests.status,
        requestedAt: sellerPayoutRequests.requestedAt,
        bankName: sellerBankAccounts.bankName,
        last4: sellerBankAccounts.accountNumberLast4,
      })
      .from(sellerPayoutRequests)
      .leftJoin(
        sellerBankAccounts,
        eq(sellerPayoutRequests.bankAccountId, sellerBankAccounts.id)
      )
      .where(
        and(
          eq(sellerPayoutRequests.sellerId, sellerId),
          isNull(sellerPayoutRequests.deletedAt)
        )
      )
      .orderBy(desc(sellerPayoutRequests.requestedAt))
      .limit(50);

    const items: LedgerItemDto[] = payoutRows.map((p) => {
      const bankLabel = p.bankName
        ? `${p.bankName} x-${p.last4 || "4921"}`
        : "Bank Wire Transfer x-4921";
      return {
        id: p.payoutNumber,
        referenceNumber: p.id,
        date: p.requestedAt
          ? new Intl.DateTimeFormat("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }).format(new Date(p.requestedAt))
          : "Recent",
        desc: bankLabel,
        amount: `₹${parseFloat(p.amount || "0").toFixed(2)}`,
        type: "settled",
        status: p.status,
      };
    });

    return {
      viewType: "settlements",
      items,
      totalCount: items.length,
    };
  }
}

export async function createSellerPayoutRequest(
  sellerId: string,
  dto: RequestPayoutDto
) {
  // 1. Verify available balance
  const summary = await getSellerEarningsSummary(sellerId);
  const available = parseFloat(summary.availablePayoutBalance);

  if (dto.amount > available) {
    throw new Error(
      `Requested amount ₹${dto.amount.toFixed(
        2
      )} exceeds available balance ₹${available.toFixed(2)}`
    );
  }

  // 2. Select bank account
  let bankAccountId = dto.bankAccountId;
  let bankAccountDetails: any = null;

  if (bankAccountId) {
    const [acc] = await db
      .select()
      .from(sellerBankAccounts)
      .where(
        and(
          eq(sellerBankAccounts.id, bankAccountId),
          eq(sellerBankAccounts.sellerId, sellerId),
          isNull(sellerBankAccounts.deletedAt)
        )
      )
      .limit(1);
    if (!acc) throw new Error("Selected bank account not found or unauthorized");
    bankAccountDetails = acc;
  } else {
    const [primary] = await db
      .select()
      .from(sellerBankAccounts)
      .where(
        and(
          eq(sellerBankAccounts.sellerId, sellerId),
          isNull(sellerBankAccounts.deletedAt)
        )
      )
      .orderBy(desc(sellerBankAccounts.isPrimary))
      .limit(1);
    bankAccountId = primary?.id;
    bankAccountDetails = primary;
  }

  const payoutNumber = `SET-${Math.floor(1000 + Math.random() * 9000)}`;

  // 3. Insert Payout Request
  const [createdRequest] = await db
    .insert(sellerPayoutRequests)
    .values({
      sellerId,
      bankAccountId: bankAccountId || null,
      payoutNumber,
      amount: dto.amount.toFixed(2),
      currency: "INR",
      status: "PROCESSING",
      gateway: "STRIPE_TEST",
      notes: dto.notes || "Seller withdrawal payout",
    })
    .returning();

  // 4. Process through Free Test Payment Gateway
  const gatewayResult = await PayoutGatewayService.processPayout({
    sellerId,
    amount: dto.amount,
    currency: "INR",
    payoutNumber,
    bankAccount: bankAccountDetails
      ? {
          accountHolderName: bankAccountDetails.accountHolderName,
          bankName: bankAccountDetails.bankName,
          accountNumberLast4: bankAccountDetails.accountNumberLast4,
          ifscCode: bankAccountDetails.ifscCode,
          upiId: bankAccountDetails.upiId,
        }
      : undefined,
  });

  // 5. Update payout request status
  const [updatedRequest] = await db
    .update(sellerPayoutRequests)
    .set({
      status: gatewayResult.status,
      gateway: gatewayResult.gateway,
      gatewayPayoutId: gatewayResult.gatewayPayoutId,
      gatewayResponse: gatewayResult.rawResponse,
      processedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(sellerPayoutRequests.id, createdRequest.id))
    .returning();

  return {
    success: true,
    requestId: updatedRequest.payoutNumber,
    payoutId: updatedRequest.id,
    amount: updatedRequest.amount,
    status: updatedRequest.status,
    gatewayPayoutId: updatedRequest.gatewayPayoutId,
    requestedAt: updatedRequest.requestedAt.toISOString(),
  };
}

export async function getSellerBankAccountsList(sellerId: string) {
  return db
    .select()
    .from(sellerBankAccounts)
    .where(
      and(
        eq(sellerBankAccounts.sellerId, sellerId),
        isNull(sellerBankAccounts.deletedAt)
      )
    );
}

export async function upsertSellerBankAccount(
  sellerId: string,
  dto: UpdateBankAccountDto
) {
  const last4 = dto.accountNumber.slice(-4);
  const existing = await db
    .select()
    .from(sellerBankAccounts)
    .where(
      and(
        eq(sellerBankAccounts.sellerId, sellerId),
        isNull(sellerBankAccounts.deletedAt)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    const [updated] = await db
      .update(sellerBankAccounts)
      .set({
        accountHolderName: dto.accountHolderName,
        bankName: dto.bankName,
        accountNumber: dto.accountNumber,
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

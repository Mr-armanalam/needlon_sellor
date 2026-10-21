import { db } from "@/db";
import { orders } from "@/db/schema/orders/table";
import { orderItems } from "@/db/schema/orders/order-items/table";
import { sellerStore } from "@/db/schema/seller/seller-store";
import { sellerProfiles } from "@/db/schema/seller/seller-profile";
import { sellerBankAccounts } from "@/db/schema/seller/seller-bank-account";
import { sellerPayoutRequests } from "@/db/schema/seller/seller-payout-request";
import { productsTable } from "@/db/schema/catalog/products/table";
import { productVariantsTable } from "@/db/schema/catalog/products/product-variants/table";
import { inventoryTable } from "@/db/schema/catalog/products/inventory/table";
import { pricingTable } from "@/db/schema/catalog/products/pricing/table";
import { and, eq, isNull, sql, desc, gte, lt } from "drizzle-orm";
import { formatDistanceToNowStrict } from "date-fns";
import { getCommissionRate } from "@/modules/platform-settings/services/platform-settings.service";
import {
  DashboardOverviewResponseDto,
  WeeklyChartPointDto,
  BusinessInsightDto,
  PerformanceMetricDto,
  RecentOrderOverviewDto,
  MilestoneItemDto,
  DashboardProductDto,
} from "../dto/dashboard.dto";

export async function getDashboardOverviewData(
  sellerId: string
): Promise<DashboardOverviewResponseDto> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  // ISO variants for the raw sql`` aggregates below: the postgres driver
  // cannot serialize raw Date parameters inside sql templates (it throws
  // "The string argument must be of type string... Received an instance of
  // Date"), which made the whole dashboard endpoint return 500. Typed
  // comparisons (gte/lt) keep using the Date objects above.
  const startOfTodayIso = startOfToday.toISOString();
  const startOfYesterdayIso = startOfYesterday.toISOString();
  const sevenDaysAgoIso = sevenDaysAgo.toISOString();
  const fourteenDaysAgoIso = fourteenDaysAgo.toISOString();
  const thirtyDaysAgoIso = thirtyDaysAgo.toISOString();
  const sixtyDaysAgoIso = sixtyDaysAgo.toISOString();

  // 1. Fetch Store & Profile
  const [storeRecord] = await db
    .select({
      storeName: sellerStore.storeName,
      storeSlug: sellerStore.storeSlug,
      logoUrl: sellerStore.logoUrl,
      bannerUrl: sellerStore.bannerUrl,
      isVerified: sellerStore.isVerified,
      shortDescription: sellerStore.shortDescription,
    })
    .from(sellerStore)
    .where(and(eq(sellerStore.sellerId, sellerId), isNull(sellerStore.deletedAt)))
    .limit(1);

  const [profileRecord] = await db
    .select({
      displayName: sellerProfiles.displayName,
      phoneVerified: sellerProfiles.phoneVerified,
    })
    .from(sellerProfiles)
    .where(eq(sellerProfiles.sellerId, sellerId))
    .limit(1);

  // 2. Welcome Metrics: Today's Sales & Orders vs Yesterday
  const [todaySalesAgg] = await db
    .select({
      todaySales: sql<string>`COALESCE(SUM(CASE WHEN ${orders.createdAt} >= ${startOfTodayIso} AND ${orders.status} NOT IN ('CANCELLED', 'RETURNED') THEN ${orders.grandTotal} ELSE 0 END), 0)`,
      yesterdaySales: sql<string>`COALESCE(SUM(CASE WHEN ${orders.createdAt} >= ${startOfYesterdayIso} AND ${orders.createdAt} < ${startOfTodayIso} AND ${orders.status} NOT IN ('CANCELLED', 'RETURNED') THEN ${orders.grandTotal} ELSE 0 END), 0)`,
      todayOrders: sql<number>`COALESCE(SUM(CASE WHEN ${orders.createdAt} >= ${startOfTodayIso} THEN 1 ELSE 0 END), 0)::int`,
      yesterdayOrders: sql<number>`COALESCE(SUM(CASE WHEN ${orders.createdAt} >= ${startOfYesterdayIso} AND ${orders.createdAt} < ${startOfTodayIso} THEN 1 ELSE 0 END), 0)::int`,
      pendingOrdersCount: sql<number>`COALESCE(SUM(CASE WHEN ${orders.status} = 'PENDING' THEN 1 ELSE 0 END), 0)::int`,
    })
    .from(orders)
    .where(and(eq(orders.sellerId, sellerId), isNull(orders.deletedAt)));

  const todaySalesNum = parseFloat(todaySalesAgg?.todaySales || "0");
  const yesterdaySalesNum = parseFloat(todaySalesAgg?.yesterdaySales || "0");
  // Honest change: with no yesterday baseline there is no real percentage,
  // so null is returned and the UI renders "—" instead of an invented figure.
  const salesChangePercent: number | null =
    yesterdaySalesNum > 0
      ? Math.round(((todaySalesNum - yesterdaySalesNum) / yesterdaySalesNum) * 100)
      : todaySalesNum > 0
      ? null
      : 0;

  const todayOrdersNum = todaySalesAgg?.todayOrders || 0;
  const yesterdayOrdersNum = todaySalesAgg?.yesterdayOrders || 0;
  const orderDiff = todayOrdersNum - yesterdayOrdersNum;

  // 3. Lifetime and Weekly Earnings for Earnings Card
  const [earningsAgg] = await db
    .select({
      totalDeliveredGross: sql<string>`COALESCE(SUM(CASE WHEN ${orders.status} IN ('DELIVERED', 'COMPLETED') THEN ${orders.grandTotal} ELSE 0 END), 0)`,
      last7DaysGross: sql<string>`COALESCE(SUM(CASE WHEN ${orders.createdAt} >= ${sevenDaysAgoIso} AND ${orders.status} NOT IN ('CANCELLED', 'RETURNED') THEN ${orders.grandTotal} ELSE 0 END), 0)`,
      prev7DaysGross: sql<string>`COALESCE(SUM(CASE WHEN ${orders.createdAt} >= ${fourteenDaysAgoIso} AND ${orders.createdAt} < ${sevenDaysAgoIso} AND ${orders.status} NOT IN ('CANCELLED', 'RETURNED') THEN ${orders.grandTotal} ELSE 0 END), 0)`,
      last30DaysGross: sql<string>`COALESCE(SUM(CASE WHEN ${orders.createdAt} >= ${thirtyDaysAgoIso} AND ${orders.status} NOT IN ('CANCELLED', 'RETURNED') THEN ${orders.grandTotal} ELSE 0 END), 0)`,
      prev30DaysGross: sql<string>`COALESCE(SUM(CASE WHEN ${orders.createdAt} >= ${sixtyDaysAgoIso} AND ${orders.createdAt} < ${thirtyDaysAgoIso} AND ${orders.status} NOT IN ('CANCELLED', 'RETURNED') THEN ${orders.grandTotal} ELSE 0 END), 0)`,
      last30DaysOrders: sql<number>`COALESCE(SUM(CASE WHEN ${orders.createdAt} >= ${thirtyDaysAgoIso} AND ${orders.status} NOT IN ('CANCELLED', 'RETURNED') THEN 1 ELSE 0 END), 0)::int`,
      prev30DaysOrders: sql<number>`COALESCE(SUM(CASE WHEN ${orders.createdAt} >= ${sixtyDaysAgoIso} AND ${orders.createdAt} < ${thirtyDaysAgoIso} AND ${orders.status} NOT IN ('CANCELLED', 'RETURNED') THEN 1 ELSE 0 END), 0)::int`,
    })
    .from(orders)
    .where(and(eq(orders.sellerId, sellerId), isNull(orders.deletedAt)));

  const [payoutAgg] = await db
    .select({
      totalWithdrawn: sql<string>`COALESCE(SUM(CASE WHEN ${sellerPayoutRequests.status} = 'COMPLETED' THEN ${sellerPayoutRequests.amount} ELSE 0 END), 0)`,
      pendingWithdrawn: sql<string>`COALESCE(SUM(CASE WHEN ${sellerPayoutRequests.status} IN ('PENDING', 'PROCESSING') THEN ${sellerPayoutRequests.amount} ELSE 0 END), 0)`,
    })
    .from(sellerPayoutRequests)
    .where(and(eq(sellerPayoutRequests.sellerId, sellerId), isNull(sellerPayoutRequests.deletedAt)));

  const deliveredGross = parseFloat(earningsAgg?.totalDeliveredGross || "0");
  // Platform commission rate from platform_settings (admin-managed).
  const commissionRate = await getCommissionRate();
  const netEarnings = deliveredGross * (1 - commissionRate);
  const totalWithdrawn = parseFloat(payoutAgg?.totalWithdrawn || "0");
  const pendingWithdrawn = parseFloat(payoutAgg?.pendingWithdrawn || "0");
  const availableBalanceNum = Math.max(0, netEarnings - totalWithdrawn - pendingWithdrawn);

  const last7DaysNum = parseFloat(earningsAgg?.last7DaysGross || "0");
  const prev7DaysNum = parseFloat(earningsAgg?.prev7DaysGross || "0");
  // Null when the prior week has no data: there is no honest growth figure,
  // so the UI renders "—" rather than an invented percentage.
  const weeklyGrowth: string | null =
    prev7DaysNum > 0
      ? (((last7DaysNum - prev7DaysNum) / prev7DaysNum) * 100).toFixed(1)
      : null;
  const isPositiveWeeklyGrowth =
    weeklyGrowth === null ? true : parseFloat(weeklyGrowth) >= 0;

  // 4. 7-Day Revenue Breakdown for Bar Chart
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayBuckets: { [key: string]: number } = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  const chartRows = await db
    .select({
      dayOfWeek: sql<string>`TO_CHAR(${orders.createdAt}, 'Dy')`,
      total: sql<number>`COALESCE(SUM(${orders.grandTotal}), 0)::float`,
      orderCount: sql<number>`COUNT(*)::int`,
    })
    .from(orders)
    .where(
      and(
        eq(orders.sellerId, sellerId),
        isNull(orders.deletedAt),
        gte(orders.createdAt, sevenDaysAgo),
        sql`${orders.status} NOT IN ('CANCELLED', 'RETURNED')`
      )
    )
    .groupBy(sql`TO_CHAR(${orders.createdAt}, 'Dy')`);

  const dayOrderCounts: { [key: string]: number } = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  for (const row of chartRows) {
    if (dayBuckets[row.dayOfWeek] !== undefined) {
      dayBuckets[row.dayOfWeek] = row.total;
      dayOrderCounts[row.dayOfWeek] = row.orderCount;
    }
  }

  // Fallback realistic mockup distribution if brand new seller with 0 orders
  const maxDayVal = Math.max(1, ...Object.values(dayBuckets));
  const weeklyData: WeeklyChartPointDto[] = daysOfWeek.map((day) => {
    const raw = dayBuckets[day] || 0;
    const heightPercent =
      maxDayVal > 0 && raw > 0
        ? Math.max(15, Math.round((raw / maxDayVal) * 100))
        : 15;
    return {
      day,
      amount: `₹${raw.toLocaleString("en-IN")}`,
      height: `h-[${heightPercent}%]`,
      rawAmount: raw,
    };
  });

  // 5. Performance Snapshot: 30-Day Aggregates & Sparklines
  const [itemsSoldAgg] = await db
    .select({
      totalSold: sql<number>`COALESCE(SUM(${orderItems.quantity}), 0)::int`,
    })
    .from(orderItems)
    .where(
      and(
        eq(orderItems.sellerId, sellerId),
        isNull(orderItems.deletedAt),
        gte(orderItems.createdAt, thirtyDaysAgo)
      )
    );

  // Prior 30-day window, so the Products Sold change is a real comparison.
  const [itemsSoldPrevAgg] = await db
    .select({
      totalSold: sql<number>`COALESCE(SUM(${orderItems.quantity}), 0)::int`,
    })
    .from(orderItems)
    .where(
      and(
        eq(orderItems.sellerId, sellerId),
        isNull(orderItems.deletedAt),
        gte(orderItems.createdAt, sixtyDaysAgo),
        lt(orderItems.createdAt, thirtyDaysAgo)
      )
    );

  // Real daily items-sold series for the last 7 days (sparkline source).
  const itemDayBuckets: { [key: string]: number } = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };
  const itemDayRows = await db
    .select({
      dayOfWeek: sql<string>`TO_CHAR(${orderItems.createdAt}, 'Dy')`,
      total: sql<number>`COALESCE(SUM(${orderItems.quantity}), 0)::float`,
    })
    .from(orderItems)
    .where(
      and(
        eq(orderItems.sellerId, sellerId),
        isNull(orderItems.deletedAt),
        gte(orderItems.createdAt, sevenDaysAgo)
      )
    )
    .groupBy(sql`TO_CHAR(${orderItems.createdAt}, 'Dy')`);

  for (const row of itemDayRows) {
    if (itemDayBuckets[row.dayOfWeek] !== undefined) {
      itemDayBuckets[row.dayOfWeek] = row.total;
    }
  }

  const [customerAgg] = await db
    .select({
      totalUniqueCustomers: sql<number>`COUNT(DISTINCT ${orders.buyerId})::int`,
    })
    .from(orders)
    .where(and(eq(orders.sellerId, sellerId), isNull(orders.deletedAt)));

  // Repeat customers = buyers with more than one order. Written as an
  // explicit SQL query: the Drizzle subquery version generated an unaliased
  // COUNT(*) column, so the outer order_count reference never resolved.
  const repeatRows = await db.execute<{ repeat_customers: number }>(sql`
    SELECT COALESCE(SUM(CASE WHEN order_count > 1 THEN 1 ELSE 0 END), 0)::int AS repeat_customers
    FROM (
      SELECT COUNT(*) AS order_count
      FROM product_orders
      WHERE seller_id = ${sellerId} AND deleted_at IS NULL
      GROUP BY buyer_id
    ) AS cust_counts
  `);
  const repeatCustomers = repeatRows[0]?.repeat_customers ?? 0;

  const totalCust = customerAgg?.totalUniqueCustomers || 0;
  const repeatCust = repeatCustomers;
  // Honest zero state: no customers yet means 0%, not an invented default.
  const repeatPercentage = totalCust > 0 ? Math.round((repeatCust / totalCust) * 100) : 0;

  // Percent change between two periods, or null when the prior period has
  // no data to compare against (the UI renders "—" for null).
  const growthPct = (current: number, previous: number): string | null =>
    previous > 0 ? (((current - previous) / previous) * 100).toFixed(1) : null;
  const formatChange = (growth: string | null): string =>
    growth === null ? "—" : `${parseFloat(growth) >= 0 ? "+" : ""}${growth}%`;

  const rev30Num = parseFloat(earningsAgg?.last30DaysGross || "0");
  const prev30Num = parseFloat(earningsAgg?.prev30DaysGross || "0");
  const rev30Growth = growthPct(rev30Num, prev30Num);

  const itemsSold30 = itemsSoldAgg?.totalSold || 0;
  const itemsSoldPrev30 = itemsSoldPrevAgg?.totalSold || 0;
  const itemsGrowth = growthPct(itemsSold30, itemsSoldPrev30);

  // Average order value from the same real 30-day aggregates.
  const orders30 = earningsAgg?.last30DaysOrders || 0;
  const prevOrders30 = earningsAgg?.prev30DaysOrders || 0;
  const aov30 = orders30 > 0 ? rev30Num / orders30 : 0;
  const prevAov30 = prevOrders30 > 0 ? prev30Num / prevOrders30 : 0;
  const aovGrowth = growthPct(aov30, prevAov30);

  const performance: PerformanceMetricDto[] = [
    {
      title: "Revenue",
      value: `₹${rev30Num.toLocaleString("en-IN")}`,
      change: formatChange(rev30Growth),
      isPositive: rev30Growth === null ? true : parseFloat(rev30Growth) >= 0,
      // Real last-7-days daily revenue, from the weekly chart buckets.
      sparkline: weeklyData.map((d) => d.rawAmount),
    },
    {
      title: "Products Sold",
      value: `${itemsSold30} items`,
      change: formatChange(itemsGrowth),
      isPositive: itemsGrowth === null ? true : parseFloat(itemsGrowth) >= 0,
      // Real last-7-days daily items sold.
      sparkline: daysOfWeek.map((day) => itemDayBuckets[day] || 0),
    },
    {
      title: "Average Order Value",
      value: `₹${Math.round(aov30).toLocaleString("en-IN")}`,
      change: formatChange(aovGrowth),
      isPositive: aovGrowth === null ? true : parseFloat(aovGrowth) >= 0,
      // Real last-7-days daily average order value (revenue / orders).
      sparkline: daysOfWeek.map((day) => {
        const count = dayOrderCounts[day] || 0;
        return count > 0 ? Math.round((dayBuckets[day] || 0) / count) : 0;
      }),
    },
    {
      title: "Returning Customers",
      value: `${repeatPercentage}%`,
      // No period-split baseline is computed for this ratio, so no change
      // figure is shown rather than an invented one.
      change: "—",
      isPositive: true,
      sparkline: [],
    },
  ];

  // 6. Recent Orders (Top 4 latest)
  const recentOrdersRaw = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      customerName: orders.buyerName,
      grandTotal: orders.grandTotal,
      status: orders.status,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(and(eq(orders.sellerId, sellerId), isNull(orders.deletedAt)))
    .orderBy(desc(orders.createdAt))
    .limit(4);

  // Fetch first item name for each order
  const recentOrders: RecentOrderOverviewDto[] = await Promise.all(
    recentOrdersRaw.map(async (o) => {
      const [firstItem] = await db
        .select({ productName: orderItems.productName })
        .from(orderItems)
        .where(eq(orderItems.orderId, o.id))
        .limit(1);

      const custName = o.customerName || "Customer";
      const initials = custName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      let timeAgo = "Just now";
      try {
        timeAgo = formatDistanceToNowStrict(o.createdAt, { addSuffix: true });
      } catch {
        timeAgo = "Recently";
      }

      return {
        id: o.id,
        customer: custName,
        initials: initials || "CU",
        product: firstItem?.productName || "Order Item",
        amount: `₹${parseFloat(o.grandTotal || "0").toLocaleString("en-IN")}`,
        time: timeAgo,
        status: o.status || "PENDING",
        rawTotal: parseFloat(o.grandTotal || "0"),
      };
    })
  );

  // 7. Smart Insights Generation
  const insights: BusinessInsightDto[] = [];

  // Low stock insight. Inventory is tracked per variant, so product stock
  // is the sum across its variants. (This query previously joined inventory
  // via a productId column that does not exist and crashed the endpoint.)
  const [lowStockProd] = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      stock: sql<number>`COALESCE(SUM(${inventoryTable.quantity}), 0)::int`,
    })
    .from(productsTable)
    .leftJoin(
      productVariantsTable,
      eq(productVariantsTable.productId, productsTable.id)
    )
    .leftJoin(
      inventoryTable,
      eq(inventoryTable.variantId, productVariantsTable.id)
    )
    .where(and(eq(productsTable.storeId, sellerId), isNull(productsTable.deletedAt)))
    .groupBy(productsTable.id, productsTable.name)
    .having(sql`COALESCE(SUM(${inventoryTable.quantity}), 0) <= 5`)
    .limit(1);

  if (lowStockProd) {
    insights.push({
      id: "insight-low-stock",
      type: "alert",
      message: `Your ${lowStockProd.name} has only ${lowStockProd.stock} items left in stock.`,
      actionLabel: "Restock now",
      actionUrl: "/inventory",
    });
  } else {
    insights.push({
      id: "insight-stock-good",
      type: "alert",
      message: "Inventory health is stable. Check out restocking projections for trending items.",
      actionLabel: "View Inventory",
      actionUrl: "/inventory",
    });
  }

  // Pending orders insight or growth insight
  const pendingCount = todaySalesAgg?.pendingOrdersCount || 0;
  if (pendingCount > 0) {
    insights.push({
      id: "insight-pending-orders",
      type: "growth",
      message: `You have ${pendingCount} incoming order${pendingCount > 1 ? "s" : ""} waiting for seller confirmation.`,
      actionLabel: "Process orders",
      actionUrl: "/orders?status=PENDING",
    });
  } else {
    insights.push({
      id: "insight-catalog-growth",
      type: "growth",
      message: "Adding 5 more products this week can increase your shop visibility by up to 25%.",
      actionLabel: "Add item",
      actionUrl: "/products/new",
    });
  }

  // 8. Seller Growth Milestones
  const [bankAccount] = await db
    .select({ id: sellerBankAccounts.id })
    .from(sellerBankAccounts)
    .where(and(eq(sellerBankAccounts.sellerId, sellerId), isNull(sellerBankAccounts.deletedAt)))
    .limit(1);

  const hasShopProfile = !!(storeRecord?.storeName && storeRecord?.shortDescription);
  const hasPhoneVerified = !!profileRecord?.phoneVerified;
  const hasVerifiedShop = !!storeRecord?.isVerified;
  const hasLogo = !!storeRecord?.logoUrl;
  const hasCoverPhoto = !!storeRecord?.bannerUrl;

  const milestones: MilestoneItemDto[] = [
    {
      id: 1,
      label: "Shop Profile",
      completed: hasShopProfile,
      actionUrl: "/settings/profile",
    },
    {
      id: 2,
      label: "Verified Phone",
      completed: hasPhoneVerified,
      actionUrl: "/settings/security",
    },
    {
      id: 3,
      label: "Verified Shop",
      completed: hasVerifiedShop,
      actionUrl: "/verification",
    },
    {
      id: 4,
      label: "Add Logo",
      completed: hasLogo,
      actionUrl: "/settings/store",
    },
    {
      id: 5,
      label: "Add Cover Photo",
      completed: hasCoverPhoto,
      actionUrl: "/settings/store",
    },
  ];

  const completedMilestones = milestones.filter((m) => m.completed).length;
  const milestonePercentage = Math.round((completedMilestones / milestones.length) * 100);
  const sellerLevel =
    milestonePercentage === 100
      ? "Verified Pro Seller"
      : milestonePercentage >= 60
      ? "Level 1 Seller"
      : "New Seller";

  // 9. Products Overview (Top 5 products)
  const productsRaw = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      slug: productsTable.slug,
      // Stock and pricing both live on variants: aggregate per product.
      stock: sql<number>`COALESCE(SUM(${inventoryTable.quantity}), 0)::int`,
      price: sql<string>`COALESCE(MIN(${pricingTable.price}), '0')`,
    })
    .from(productsTable)
    .leftJoin(
      productVariantsTable,
      eq(productVariantsTable.productId, productsTable.id)
    )
    .leftJoin(
      inventoryTable,
      eq(inventoryTable.variantId, productVariantsTable.id)
    )
    .leftJoin(pricingTable, eq(pricingTable.variantId, productVariantsTable.id))
    .where(and(eq(productsTable.storeId, sellerId), isNull(productsTable.deletedAt)))
    .groupBy(productsTable.id, productsTable.name, productsTable.slug)
    .limit(5);

  const colors = [
    "bg-orange-100 text-orange-700",
    "bg-blue-100 text-blue-700",
    "bg-amber-100 text-amber-700",
    "bg-emerald-100 text-emerald-700",
    "bg-purple-100 text-purple-700",
  ];

  // Real per-product sales: total order-item quantities for this seller.
  // (Views/likes have no data source anywhere in the system and are no
  // longer reported; stock below is the real summed inventory quantity.)
  const productSalesRows = await db
    .select({
      productId: orderItems.productId,
      totalSold: sql<number>`COALESCE(SUM(${orderItems.quantity}), 0)::int`,
    })
    .from(orderItems)
    .where(and(eq(orderItems.sellerId, sellerId), isNull(orderItems.deletedAt)))
    .groupBy(orderItems.productId);

  const salesByProductId = new Map<string, number>();
  for (const row of productSalesRows) {
    if (row.productId) {
      salesByProductId.set(row.productId, row.totalSold);
    }
  }

  const products: DashboardProductDto[] = productsRaw.map((p, idx) => {
    const initials = p.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      stock: p.stock,
      sales: salesByProductId.get(p.id) ?? 0,
      price: `₹${parseFloat(p.price || "0").toLocaleString("en-IN")}`,
      initials: initials || "PR",
      imageColor: colors[idx % colors.length],
    };
  });

  return {
    welcomeMetrics: [
      {
        title: "Today's Sales",
        value: `₹${todaySalesNum.toLocaleString("en-IN")}`,
        change:
          salesChangePercent === null
            ? "—"
            : `${salesChangePercent >= 0 ? "+" : ""}${salesChangePercent}%`,
        isPositive: salesChangePercent === null ? true : salesChangePercent >= 0,
        type: "sales",
      },
      {
        title: "Orders",
        value: todayOrdersNum.toString(),
        change: `${orderDiff >= 0 ? "+" : ""}${orderDiff}`,
        isPositive: orderDiff >= 0,
        type: "orders",
      },
      {
        title: "Pending Orders",
        value: pendingCount.toString(),
        change: pendingCount > 0 ? "Action needed" : "All clear",
        isImgDanger: pendingCount > 0,
        isPositive: pendingCount === 0,
        type: "messages",
      },
    ],
    earnings: {
      availableBalance: `₹${availableBalanceNum.toLocaleString("en-IN")}`,
      growthText:
        weeklyGrowth === null ? "—" : `${weeklyGrowth}% growth this week`,
      isPositiveGrowth: isPositiveWeeklyGrowth,
      weeklyData,
    },
    insights,
    performance,
    recentOrders,
    sellerGrowth: {
      level: sellerLevel,
      percentage: milestonePercentage,
      completedCount: completedMilestones,
      totalCount: milestones.length,
      milestones,
    },
    products,
    storeSlug: storeRecord?.storeSlug,
  };
}

import assert from "node:assert";
import {
  dashboardOverviewResponseSchema,
  welcomeMetricSchema,
  weeklyChartPointSchema,
  businessInsightSchema,
  sellerGrowthOverviewSchema,
} from "../modules/dashboard/dto/dashboard.dto";

function testDashboardZodValidations() {
  console.log("--> Testing Dashboard DTO Validations...");

  // 1. Welcome Metric validation
  const validMetric = {
    title: "Today's Sales",
    value: "₹4,850",
    change: "+12%",
    isPositive: true,
    type: "sales" as const,
  };
  const parsedMetric = welcomeMetricSchema.parse(validMetric);
  assert.strictEqual(parsedMetric.title, "Today's Sales");
  assert.strictEqual(parsedMetric.isPositive, true);

  // 2. Weekly chart point validation
  const validChartPoint = {
    day: "Mon",
    amount: "₹1,200",
    height: "h-[35%]",
    rawAmount: 1200,
  };
  const parsedChartPoint = weeklyChartPointSchema.parse(validChartPoint);
  assert.strictEqual(parsedChartPoint.day, "Mon");
  assert.strictEqual(parsedChartPoint.rawAmount, 1200);

  // 3. Business Insight validation
  const validInsight = {
    id: "insight-1",
    type: "alert" as const,
    message: "Low stock alert",
    actionLabel: "Restock now",
    actionUrl: "/inventory",
  };
  const parsedInsight = businessInsightSchema.parse(validInsight);
  assert.strictEqual(parsedInsight.type, "alert");

  // 4. Full Dashboard response validation
  const fullPayload = {
    welcomeMetrics: [validMetric],
    earnings: {
      availableBalance: "₹12,450",
      growthText: "+18.4% growth this week",
      isPositiveGrowth: true,
      weeklyData: [validChartPoint],
    },
    insights: [validInsight],
    performance: [
      {
        title: "Revenue",
        value: "₹24,850",
        change: "+14.2%",
        isPositive: true,
        sparkline: [20, 35, 30, 45, 40, 55, 60],
      },
    ],
    recentOrders: [
      {
        id: "ORD-9421",
        customer: "Priya Sharma",
        initials: "PS",
        product: "Handloom Chikankari Kurti",
        amount: "₹2,450",
        time: "12 mins ago",
        status: "PENDING",
        rawTotal: 2450,
      },
    ],
    sellerGrowth: {
      level: "Level 1 Seller",
      percentage: 60,
      completedCount: 3,
      totalCount: 5,
      milestones: [
        { id: 1, label: "Shop Profile", completed: true, actionUrl: "/settings/profile" },
        { id: 2, label: "Verified Phone", completed: true, actionUrl: "/settings/security" },
        { id: 3, label: "Verified Shop", completed: true, actionUrl: "/verification" },
        { id: 4, label: "Add Logo", completed: false, actionUrl: "/settings/store" },
        { id: 5, label: "Add Cover Photo", completed: false, actionUrl: "/settings/store" },
      ],
    },
    products: [
      {
        id: "prod-1",
        name: "Handloom Kurti",
        slug: "handloom-kurti",
        stock: 14,
        views: 520,
        likes: 84,
        sales: 32,
        price: "₹2,450",
        initials: "HK",
      },
    ],
  };

  const parsedOverview = dashboardOverviewResponseSchema.parse(fullPayload);
  assert.strictEqual(parsedOverview.welcomeMetrics.length, 1);
  assert.strictEqual(parsedOverview.earnings.availableBalance, "₹12,450");
  assert.strictEqual(parsedOverview.sellerGrowth.percentage, 60);

  console.log("✓ Dashboard DTO validation tests passed.");
}

function testSellerMilestoneLevelCalculations() {
  console.log("--> Testing Seller Milestone Level Calculations...");

  function computeSellerLevel(completedCount: number, totalCount: number) {
    const percentage = Math.round((completedCount / totalCount) * 100);
    if (percentage === 100) return "Verified Pro Seller";
    if (percentage >= 60) return "Level 1 Seller";
    return "New Seller";
  }

  assert.strictEqual(computeSellerLevel(0, 5), "New Seller");
  assert.strictEqual(computeSellerLevel(1, 5), "New Seller"); // 20%
  assert.strictEqual(computeSellerLevel(2, 5), "New Seller"); // 40%
  assert.strictEqual(computeSellerLevel(3, 5), "Level 1 Seller"); // 60%
  assert.strictEqual(computeSellerLevel(4, 5), "Level 1 Seller"); // 80%
  assert.strictEqual(computeSellerLevel(5, 5), "Verified Pro Seller"); // 100%

  console.log("✓ Seller Milestone Level Calculation tests passed.");
}

function testWeeklyChartHeightNormalization() {
  console.log("--> Testing Weekly Chart Height Normalization...");

  function normalizeBarHeight(value: number, maxVal: number): number {
    if (maxVal <= 0 || value <= 0) return 15;
    return Math.max(15, Math.round((value / maxVal) * 100));
  }

  // Max value is 1000
  assert.strictEqual(normalizeBarHeight(1000, 1000), 100);
  assert.strictEqual(normalizeBarHeight(500, 1000), 50);
  assert.strictEqual(normalizeBarHeight(0, 1000), 15); // minimum aesthetic threshold
  assert.strictEqual(normalizeBarHeight(50, 1000), 15); // clamped to min 15%

  console.log("✓ Weekly Chart Height Normalization tests passed.");
}

// Run tests
try {
  testDashboardZodValidations();
  testSellerMilestoneLevelCalculations();
  testWeeklyChartHeightNormalization();
  console.log("\n All Dashboard unit tests passed successfully!");
} catch (err) {
  console.error("❌ Dashboard test failure:", err);
  process.exit(1);
}

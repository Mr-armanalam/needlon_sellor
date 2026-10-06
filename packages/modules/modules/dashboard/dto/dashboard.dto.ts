import { z } from "zod";

export const welcomeMetricSchema = z.object({
  title: z.string(),
  value: z.string(),
  change: z.string(),
  isPositive: z.boolean().default(true),
  isImgDanger: z.boolean().optional(),
  type: z.enum(["sales", "orders", "visitors", "messages"]),
});

export const weeklyChartPointSchema = z.object({
  day: z.string(),
  amount: z.string(),
  height: z.string(),
  rawAmount: z.number(),
});

export const earningsOverviewSchema = z.object({
  availableBalance: z.string(),
  growthText: z.string(),
  isPositiveGrowth: z.boolean(),
  weeklyData: z.array(weeklyChartPointSchema),
});

export const businessInsightSchema = z.object({
  id: z.string(),
  type: z.enum(["alert", "growth", "setup"]),
  message: z.string(),
  actionLabel: z.string(),
  actionUrl: z.string(),
});

export const performanceMetricSchema = z.object({
  title: z.string(),
  value: z.string(),
  change: z.string(),
  isPositive: z.boolean(),
  sparkline: z.array(z.number()),
});

export const recentOrderOverviewSchema = z.object({
  id: z.string(),
  customer: z.string(),
  initials: z.string(),
  product: z.string(),
  amount: z.string(),
  time: z.string(),
  status: z.string(),
  rawTotal: z.number(),
});

export const milestoneItemSchema = z.object({
  id: z.number(),
  label: z.string(),
  completed: z.boolean(),
  actionUrl: z.string(),
});

export const sellerGrowthOverviewSchema = z.object({
  level: z.string(),
  percentage: z.number(),
  completedCount: z.number(),
  totalCount: z.number(),
  milestones: z.array(milestoneItemSchema),
});

export const dashboardProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  stock: z.number(),
  views: z.number(),
  likes: z.number(),
  sales: z.number(),
  price: z.string(),
  initials: z.string(),
  imageColor: z.string().optional(),
});

export const dashboardOverviewResponseSchema = z.object({
  welcomeMetrics: z.array(welcomeMetricSchema),
  earnings: earningsOverviewSchema,
  insights: z.array(businessInsightSchema),
  performance: z.array(performanceMetricSchema),
  recentOrders: z.array(recentOrderOverviewSchema),
  sellerGrowth: sellerGrowthOverviewSchema,
  products: z.array(dashboardProductSchema),
  storeSlug: z.string().optional(),
});

export type WelcomeMetricDto = z.infer<typeof welcomeMetricSchema>;
export type WeeklyChartPointDto = z.infer<typeof weeklyChartPointSchema>;
export type EarningsOverviewDto = z.infer<typeof earningsOverviewSchema>;
export type BusinessInsightDto = z.infer<typeof businessInsightSchema>;
export type PerformanceMetricDto = z.infer<typeof performanceMetricSchema>;
export type RecentOrderOverviewDto = z.infer<typeof recentOrderOverviewSchema>;
export type MilestoneItemDto = z.infer<typeof milestoneItemSchema>;
export type SellerGrowthOverviewDto = z.infer<typeof sellerGrowthOverviewSchema>;
export type DashboardProductDto = z.infer<typeof dashboardProductSchema>;
export type DashboardOverviewResponseDto = z.infer<typeof dashboardOverviewResponseSchema>;

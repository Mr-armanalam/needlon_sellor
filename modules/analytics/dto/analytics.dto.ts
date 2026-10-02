import { z } from "zod";

export const getAnalyticsQuerySchema = z.object({
  timeframe: z.enum(["7d", "30d", "90d", "1y"]).optional().default("30d"),
});

export type GetAnalyticsQueryDto = z.infer<typeof getAnalyticsQuerySchema>;

export interface AnalyticsOverviewResponseDto {
  totalRevenue: string;
  totalOrders: number;
  averageOrderValue: string;
  conversionRatePercent: number;
  revenueChart: Array<{ date: string; revenue: number; orders: number }>;
  topProducts: Array<{ id: string; name: string; salesCount: number; totalRevenue: string }>;
}

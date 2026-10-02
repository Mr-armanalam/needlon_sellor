import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { getSellerAnalyticsData } from "../repository/analytics.repository";

export async function getSellerAnalyticsService(timeframe: string = "30d") {
  const seller = await getCurrentSeller();

  let days = 30;
  if (timeframe === "7d") days = 7;
  else if (timeframe === "90d") days = 90;
  else if (timeframe === "1y") days = 365;

  return getSellerAnalyticsData(seller.id, days);
}

import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getSellerAnalyticsService } from "@/modules/analytics/services/analytics.service";
import { getAnalyticsQuerySchema } from "@/modules/analytics/dto/analytics.dto";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const { searchParams } = new URL(req.url);
    const queryObj = Object.fromEntries(searchParams.entries());
    const validatedQuery = getAnalyticsQuerySchema.parse(queryObj);

    const analytics = await getSellerAnalyticsService(validatedQuery.timeframe);
    return successResponse(analytics);
  });
}

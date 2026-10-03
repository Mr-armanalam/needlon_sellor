import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getEarningsAnalyticsService } from "@/modules/earnings/services/earnings.service";
import { earningsAnalyticsQuerySchema } from "@/modules/earnings/dto/finance.dto";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const { searchParams } = new URL(req.url);
    const queryObj = Object.fromEntries(searchParams.entries());
    const validatedDto = earningsAnalyticsQuerySchema.parse(queryObj);

    const analytics = await getEarningsAnalyticsService(validatedDto);
    return successResponse(analytics);
  });
}

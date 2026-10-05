import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getFeedbackRoadmapItemsService } from "@/modules/feedback/services/feedback.service";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const items = await getFeedbackRoadmapItemsService(status);
    return successResponse({ items });
  });
}

import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { toggleRoadmapUpvoteService } from "@/modules/feedback/services/feedback.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ featureId: string }> }
) {
  return routeHandler(async () => {
    const { featureId } = await params;
    const result = await toggleRoadmapUpvoteService(featureId);
    return successResponse(result);
  });
}

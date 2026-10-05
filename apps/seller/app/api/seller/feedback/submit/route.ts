import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import { submitSellerFeedbackService } from "@/modules/feedback/services/feedback.service";
import { createFeedbackSchema } from "@/modules/feedback/dto/feedback.dto";

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await parseBody(req, createFeedbackSchema);
    const feedback = await submitSellerFeedbackService(body);
    return successResponse(feedback);
  });
}

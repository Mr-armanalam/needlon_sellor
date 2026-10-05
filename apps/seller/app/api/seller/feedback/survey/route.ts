import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import { submitSellerSurveyService } from "@/modules/feedback/services/feedback.service";
import { submitSurveySchema } from "@/modules/feedback/dto/feedback.dto";

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await parseBody(req, submitSurveySchema);
    const survey = await submitSellerSurveyService(body);
    return successResponse(survey);
  });
}

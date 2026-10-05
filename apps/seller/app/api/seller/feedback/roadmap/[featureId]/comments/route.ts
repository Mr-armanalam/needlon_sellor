import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  getFeatureCommentsService,
  addFeatureCommentService,
} from "@/modules/feedback/services/feedback.service";
import { addCommentSchema } from "@/modules/feedback/dto/feedback.dto";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ featureId: string }> }
) {
  return routeHandler(async () => {
    const { featureId } = await params;
    const comments = await getFeatureCommentsService(featureId);
    return successResponse({ comments });
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ featureId: string }> }
) {
  return routeHandler(async () => {
    const { featureId } = await params;
    const { comment } = await parseBody(req, addCommentSchema);
    const newComment = await addFeatureCommentService(featureId, comment);
    return successResponse(newComment);
  });
}

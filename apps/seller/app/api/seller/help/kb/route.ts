import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getKnowledgeBaseArticlesService } from "@/modules/help/services/help.service";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const articles = await getKnowledgeBaseArticlesService(category);
    return successResponse({ articles });
  });
}

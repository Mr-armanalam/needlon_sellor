import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { parseBody } from "@/modules/shared/api/parse-body";
import { updateDraftProductVariantsService } from "@/modules/products/services";
import { updateVariantsSchema } from "@/modules/products/validations/variants.schema";

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  return routeHandler(async () => {
    const { productId } = await params;
    const body = await parseBody(request, updateVariantsSchema);
    const updated = await updateDraftProductVariantsService(productId, body);
    return successResponse(updated);
  });
}

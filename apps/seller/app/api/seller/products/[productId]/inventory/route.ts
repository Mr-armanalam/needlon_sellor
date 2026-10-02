import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { parseBody } from "@/modules/shared/api/parse-body";
import { updateDraftProductInventoryService } from "@/modules/products/services";
import { updateInventorySchema } from "@/modules/products/validations/inventory.schema";

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
    const body = await parseBody(request, updateInventorySchema);
    const updated = await updateDraftProductInventoryService(productId, body);
    return successResponse(updated);
  });
}

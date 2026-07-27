import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { parseBody } from "@/modules/shared/api/parse-body";
import { DraftProductService } from "@/modules/products/services/draft-product.service";
import { updateVariantsSchema } from "@/modules/products/validations/variants.schema";
import { DrizzleProductRepository } from "@/modules/products/repositories/repository/product.repository";

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

const draftProductService = new DraftProductService(new DrizzleProductRepository());

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  return routeHandler(async () => {
    const { productId } = await params;
    const body = await parseBody(request, updateVariantsSchema);
    const updated = await draftProductService.updateVariants(productId, body);
    return successResponse(updated);
  });
}

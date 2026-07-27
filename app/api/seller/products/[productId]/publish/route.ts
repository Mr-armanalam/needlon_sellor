import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { parseBody } from "@/modules/shared/api/parse-body";
import { DraftProductService } from "@/modules/products/services/draft-product.service";
import { publishProductSchema } from "@/modules/products/validations/publish.schema";
import { DrizzleProductRepository } from "@/modules/products/repositories/repository/product.repository";

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

const draftProductService = new DraftProductService(new DrizzleProductRepository());

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  return routeHandler(async () => {
    const { productId } = await params;
    const body = await parseBody(request, publishProductSchema);
    const published = await draftProductService.publishProduct(productId, body);
    return successResponse(published);
  });
}

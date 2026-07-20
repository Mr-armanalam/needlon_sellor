import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { parseBody } from "@/modules/shared/api/parse-body";
import {
  productWizardSchema,
  createWizardProductService,
  listProductsService,
} from "@/modules/products";

const DEFAULT_SELLER_ID = "00000000-0000-0000-0000-000000000001";

export async function GET(request: NextRequest) {
  return routeHandler(async () => {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as any;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await listProductsService({
      sellerId: DEFAULT_SELLER_ID,
      status: status && status !== "All" ? status : undefined,
      search,
      page,
      limit,
    });

    return successResponse(result);
  });
}

export async function POST(request: NextRequest) {
  return routeHandler(async () => {
    const body = await parseBody(request, productWizardSchema);

    const created = await createWizardProductService({
      sellerId: DEFAULT_SELLER_ID,
      data: body,
    });

    return successResponse(created, 201);
  });
}

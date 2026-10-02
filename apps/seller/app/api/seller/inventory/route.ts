import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import { getSellerInventoryService, updateInventoryService } from "@/modules/products/services/inventory.service";
import { getInventoryQuerySchema, updateInventoryStockSchema } from "@/modules/products/dto/inventory.dto";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const { searchParams } = new URL(req.url);
    const queryObj = Object.fromEntries(searchParams.entries());
    const validatedQuery = getInventoryQuerySchema.parse(queryObj);

    const items = await getSellerInventoryService({
      lowStockOnly: validatedQuery.lowStockOnly === "true",
      search: validatedQuery.search,
    });

    const lowStockCount = items.filter((i) => i.isLowStock).length;

    return successResponse({
      items,
      totalCount: items.length,
      lowStockCount,
    });
  });
}

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await parseBody(req, updateInventoryStockSchema);
    const result = await updateInventoryService(body);
    return successResponse(result);
  });
}

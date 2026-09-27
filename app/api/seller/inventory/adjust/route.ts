import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import { adjustInventoryService } from "@/modules/products/services/inventory.service";
import { adjustStockSchema } from "@/modules/products/dto/inventory.dto";

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await parseBody(req, adjustStockSchema);
    const updated = await adjustInventoryService(body);
    return successResponse(updated);
  });
}

import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getSellerInventoryService } from "@/modules/products/services/inventory.service";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const alerts = await getSellerInventoryService({ lowStockOnly: true });

    return successResponse({
      alerts,
      count: alerts.length,
    });
  });
}

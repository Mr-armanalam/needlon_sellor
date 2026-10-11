import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { createInStoreOrderService } from "@/modules/customers/services/customer.service";
import { createInStoreOrderSchema } from "@/modules/customers/dto/create-in-store-order.dto";

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await req.json();
    const validatedData = createInStoreOrderSchema.parse(body);

    const result = await createInStoreOrderService(validatedData);
    return successResponse(result);
  });
}

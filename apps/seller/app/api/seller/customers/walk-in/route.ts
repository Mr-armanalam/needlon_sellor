import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { createWalkInCustomerService } from "@/modules/customers/services/customer.service";
import { createWalkInCustomerSchema } from "@/modules/customers/dto/walk-in-customer.dto";

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await req.json();
    const validatedData = createWalkInCustomerSchema.parse(body);

    const result = await createWalkInCustomerService(validatedData);
    return successResponse(result);
  });
}

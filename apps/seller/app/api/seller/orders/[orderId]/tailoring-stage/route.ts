import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { updateTailoringStageService } from "@/modules/customers/services/customer.service";
import { updateTailoringStageSchema } from "@/modules/customers/dto/create-in-store-order.dto";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  return routeHandler(async () => {
    const { orderId } = await params;
    const body = await req.json();
    const validatedData = updateTailoringStageSchema.parse(body);

    const result = await updateTailoringStageService(orderId, validatedData);
    return successResponse(result);
  });
}

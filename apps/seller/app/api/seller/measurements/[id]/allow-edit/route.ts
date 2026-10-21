import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { allowCustomerMeasurementEditService } from "@/modules/customers/services/customer.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  req: NextRequest,
  { params }: RouteContext
) {
  return routeHandler(async () => {
    const { id } = await params;
    const result = await allowCustomerMeasurementEditService(id);
    return successResponse(result);
  });
}

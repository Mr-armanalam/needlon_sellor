import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { recordInStoreMeasurementService } from "@/modules/customers/services/customer.service";
import { recordInStoreMeasurementSchema } from "@/modules/customers/dto/in-store-measurement.dto";

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await req.json();
    const validatedData = recordInStoreMeasurementSchema.parse(body);

    const result = await recordInStoreMeasurementService(validatedData);
    return successResponse(result);
  });
}

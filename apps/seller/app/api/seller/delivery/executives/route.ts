import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  createExecutiveService,
  listExecutivesService,
} from "@/modules/delivery/services/executive.service";
import {
  createExecutiveSchema,
  executiveStatusSchema,
  type DeliveryExecutiveStatus,
} from "@/modules/delivery/dto/executive.dto";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const statusParam = req.nextUrl.searchParams.get("status");
    const parsedStatus = statusParam
      ? executiveStatusSchema.safeParse(statusParam)
      : null;
    const status: DeliveryExecutiveStatus | undefined =
      parsedStatus?.success ? parsedStatus.data : undefined;
    const onlyAvailable =
      req.nextUrl.searchParams.get("available") === "true";

    const result = await listExecutivesService({
      status,
      onlyAvailable: onlyAvailable || undefined,
    });

    return successResponse(result);
  });
}

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await parseBody(req, createExecutiveSchema);
    const result = await createExecutiveService(body);
    return successResponse(result, 201);
  });
}

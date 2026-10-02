import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  getSellerNotificationsService,
  markNotificationReadService,
} from "@/modules/shared/services/notification.service";
import { markNotificationReadSchema } from "@/modules/shared/dto/notification.dto";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const data = await getSellerNotificationsService();
    return successResponse(data);
  });
}

export async function PATCH(req: NextRequest) {
  return routeHandler(async () => {
    const body = await parseBody(req, markNotificationReadSchema);
    const result = await markNotificationReadService(body);
    return successResponse(result);
  });
}

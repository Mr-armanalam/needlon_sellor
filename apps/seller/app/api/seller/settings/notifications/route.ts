import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  getNotificationPreferencesService,
  updateNotificationPreferencesService,
} from "@/modules/shared/services/notification.service";
import { updateNotificationPreferencesSchema } from "@/modules/shared/dto/notification.dto";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const preferences = await getNotificationPreferencesService();
    return successResponse(preferences);
  });
}

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await parseBody(req, updateNotificationPreferencesSchema);
    const updated = await updateNotificationPreferencesService(body);
    return successResponse(updated);
  });
}

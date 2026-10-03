import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  getDeliverySettingsService,
  updateLocalDeliverySettingsService,
  updatePickupHubService,
  addShippingZoneService,
} from "@/modules/delivery/services/delivery.service";
import {
  localDeliverySettingsSchema,
  pickupHubSchema,
  shippingZoneSchema,
} from "@/modules/delivery/dto/delivery.dto";

export async function GET() {
  return routeHandler(async () => {
    const settings = await getDeliverySettingsService();
    return successResponse(settings);
  });
}

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await req.json();
    const { type, data } = body;

    if (type === "LOCAL_RADIUS") {
      const validated = localDeliverySettingsSchema.parse(data);
      const res = await updateLocalDeliverySettingsService(validated);
      return successResponse(res, "Local delivery radius saved successfully");
    } else if (type === "PICKUP_HUB") {
      const validated = pickupHubSchema.parse(data);
      const res = await updatePickupHubService(validated);
      return successResponse(res, "Pickup hub location updated successfully");
    } else if (type === "SHIPPING_ZONE") {
      const validated = shippingZoneSchema.parse(data);
      const res = await addShippingZoneService(validated);
      return successResponse(res, "Shipping zone added successfully");
    }

    throw new Error("Invalid delivery settings update type");
  });
}

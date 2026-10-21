import { NextRequest, NextResponse } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { handleShiprocketWebhook } from "@/modules/delivery/services/carrier-booking.service";

/**
 * Shiprocket tracking webhook.
 *
 * Shiprocket sends its webhook security token in the `x-api-key` header;
 * it must match SHIPROCKET_WEBHOOK_SECRET. When the secret is not
 * configured the endpoint fails closed with 503 — unauthenticated
 * webhooks are never accepted. Unknown AWBs are acknowledged with
 * { ignored: true } so Shiprocket does not retry forever for shipments
 * that are not ours.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SHIPROCKET_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "WEBHOOK_NOT_CONFIGURED",
          message: "Shiprocket webhook secret is not configured.",
        },
      },
      { status: 503 },
    );
  }

  if (req.headers.get("x-api-key") !== secret) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Invalid webhook token." },
      },
      { status: 401 },
    );
  }

  let payload: unknown;
  try {
    payload = (await req.json()) as unknown;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "BAD_REQUEST", message: "Webhook body must be JSON." },
      },
      { status: 400 },
    );
  }

  return routeHandler(async () => {
    const result = await handleShiprocketWebhook(payload);
    return successResponse(result);
  });
}

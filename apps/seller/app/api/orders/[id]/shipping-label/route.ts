import { NextRequest, NextResponse } from "next/server";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import {
  buildShippingLabelData,
  ShippingLabelError,
} from "@/modules/orders/documents/services/shipping-label.service";
import { generateShippingLabelHTML } from "@/modules/orders/documents/templates/shipping-label-generator";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message: unknown }).message;
    return typeof message === "string" ? message : "";
  }
  return "";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const seller = await getCurrentSeller();
    if (!seller || !seller.id) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const { id: orderId } = await params;

    // The label's courier and tracking identity come from the order's
    // shipment (see buildShippingLabelData); an order without a shipment
    // has no label yet.
    const labelData = await buildShippingLabelData(orderId, seller.id);
    const html = generateShippingLabelHTML(labelData);

    return NextResponse.json({
      success: true,
      data: {
        shippingLabelData: labelData,
        html,
      },
    });
  } catch (err) {
    if (err instanceof ShippingLabelError) {
      return NextResponse.json(
        { success: false, error: { code: err.code, message: err.message } },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: getErrorMessage(err) || "Failed to generate shipping label" } },
      { status: 500 }
    );
  }
}

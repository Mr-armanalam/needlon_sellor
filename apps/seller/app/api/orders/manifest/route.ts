import { NextRequest, NextResponse } from "next/server";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { createBulkManifest, getManifestsListForSeller } from "@/modules/orders/documents/services/manifest-service";
import { generateManifestHTML } from "@/modules/orders/documents/templates/manifest-generator";

export async function POST(req: NextRequest) {
  try {
    const seller = await getCurrentSeller();
    if (!seller || !seller.id) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { orderIds = [], courierName = "Express Courier", pickupDate } = body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Missing or empty orderIds list" } },
        { status: 400 }
      );
    }

    const pDate = pickupDate ? new Date(pickupDate) : new Date();
    const { manifestRecord, manifestData } = await createBulkManifest(seller.id, orderIds, courierName, pDate);
    const html = generateManifestHTML(manifestData);

    return NextResponse.json({
      success: true,
      data: {
        manifest: manifestRecord,
        manifestData,
        html,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: err.message || "Failed to create shipment manifest" } },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const seller = await getCurrentSeller();
    if (!seller || !seller.id) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const manifests = await getManifestsListForSeller(seller.id);

    return NextResponse.json({
      success: true,
      data: manifests,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: err.message || "Failed to list manifests" } },
      { status: 500 }
    );
  }
}

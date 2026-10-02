import { NextRequest, NextResponse } from "next/server";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { getManifestDataById } from "@/modules/orders/documents/services/manifest-service";
import { generateManifestHTML } from "@/modules/orders/documents/templates/manifest-generator";

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

    const { id: manifestId } = await params;
    const { manifestRecord, manifestData } = await getManifestDataById(manifestId, seller.id);
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
      { success: false, error: { code: "INTERNAL_ERROR", message: err.message || "Failed to fetch manifest" } },
      { status: 500 }
    );
  }
}

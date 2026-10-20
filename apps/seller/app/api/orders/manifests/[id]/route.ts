import { NextRequest, NextResponse } from "next/server";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { getManifestDataById } from "@/modules/orders/documents/services/manifest-service";
import { generateManifestHTML } from "@/modules/orders/documents/templates/manifest-generator";

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
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: getErrorMessage(err) || "Failed to fetch manifest" } },
      { status: 500 }
    );
  }
}

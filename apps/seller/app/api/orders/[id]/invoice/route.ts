import { NextRequest, NextResponse } from "next/server";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { getInvoiceDataForOrder } from "@/modules/orders/documents/services/invoice-service";
import { generateInvoiceHTML } from "@/modules/orders/documents/templates/invoice-generator";

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
    const { invoiceRecord, invoiceData } = await getInvoiceDataForOrder(orderId, seller.id);
    const html = generateInvoiceHTML(invoiceData);

    return NextResponse.json({
      success: true,
      data: {
        invoice: invoiceRecord,
        invoiceData,
        html,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: getErrorMessage(err) || "Failed to fetch invoice" } },
      { status: 500 }
    );
  }
}

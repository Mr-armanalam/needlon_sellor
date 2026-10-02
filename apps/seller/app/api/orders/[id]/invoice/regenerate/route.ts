import { NextRequest, NextResponse } from "next/server";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { regenerateInvoiceForOrder } from "@/modules/orders/documents/services/invoice-service";
import { generateInvoiceHTML } from "@/modules/orders/documents/templates/invoice-generator";

export async function POST(
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
    const { invoiceRecord, invoiceData } = await regenerateInvoiceForOrder(orderId, seller.id);
    const html = generateInvoiceHTML(invoiceData);

    return NextResponse.json({
      success: true,
      data: {
        invoice: invoiceRecord,
        invoiceData,
        html,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: err.message || "Failed to regenerate invoice" } },
      { status: 500 }
    );
  }
}

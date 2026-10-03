import { NextRequest, NextResponse } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { downloadInvoiceReceiptService } from "@/modules/subscription/services/subscription.service";

interface RouteContext {
  params: Promise<{
    invoiceId: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  return routeHandler(async () => {
    const { invoiceId } = await params;
    const { filename, content } = await downloadInvoiceReceiptService(invoiceId);

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  });
}

import { NextRequest, NextResponse } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { exportLedgerCsvService } from "@/modules/earnings/services/earnings.service";
import { exportLedgerQuerySchema } from "@/modules/earnings/dto/finance.dto";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const { searchParams } = new URL(req.url);
    const queryObj = Object.fromEntries(searchParams.entries());
    const validatedDto = exportLedgerQuerySchema.parse(queryObj);

    const { filename, content } = await exportLedgerCsvService(validatedDto);

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  });
}

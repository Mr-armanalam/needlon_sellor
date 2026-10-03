import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getLedgerRecordsService } from "@/modules/earnings/services/earnings.service";
import { ledgerQuerySchema } from "@/modules/earnings/dto/finance.dto";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const { searchParams } = new URL(req.url);
    const queryObj = Object.fromEntries(searchParams.entries());
    const validatedDto = ledgerQuerySchema.parse(queryObj);

    const ledger = await getLedgerRecordsService(validatedDto);
    return successResponse(ledger);
  });
}

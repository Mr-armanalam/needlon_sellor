import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getSellerBillingLedgerService } from "@/modules/subscription/services/subscription.service";
import { billingLedgerQuerySchema } from "@/modules/subscription/dto/subscription.dto";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const { searchParams } = new URL(req.url);
    const queryObj = Object.fromEntries(searchParams.entries());
    const validatedDto = billingLedgerQuerySchema.parse(queryObj);

    const ledger = await getSellerBillingLedgerService(validatedDto);
    return successResponse(ledger);
  });
}

import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import { getSellerBankAccountsService, updateSellerBankAccountService } from "@/modules/earnings/services/earnings.service";
import { updateBankAccountSchema } from "@/modules/earnings/dto/finance.dto";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const bankAccounts = await getSellerBankAccountsService();
    return successResponse({ bankAccounts });
  });
}

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await parseBody(req, updateBankAccountSchema);
    const updated = await updateSellerBankAccountService(body);
    return successResponse(updated);
  });
}
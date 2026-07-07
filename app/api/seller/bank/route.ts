import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";

import {
    createBankAccountService,
    getSellerBankService,
} from "@/modules/seller/services";

export async function GET() {
    return routeHandler(async () => {
        const bank =
            await getSellerBankService();

        return successResponse(bank);
    });
}

export async function POST(
    request: Request,
) {
    return routeHandler(async () => {
        const body =
            await request.json();

        const account =
            await createBankAccountService(
                body,
            );

        return successResponse(account);
    });
}
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";

import {
    setPrimaryBankAccountService,
} from "@/modules/seller-profile/services";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function POST(
    request: Request,
    { params }: RouteParams,
) {
    return routeHandler(async () => {
        const { id } =
            await params;

        const account =
            await setPrimaryBankAccountService(
                id,
            );

        return successResponse(
            account,
        );
    });
}
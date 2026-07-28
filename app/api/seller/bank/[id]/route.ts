import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";

import {
    deleteBankAccountService,
    updateBankAccountService,
} from "@/modules/seller-profile/services";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function PATCH(
    request: Request,
    { params }: RouteParams,
) {
    return routeHandler(async () => {
        const { id } =
            await params;

        const body =
            await request.json();

        const account =
            await updateBankAccountService({
                accountId: id,
                ...body,
            });

        return successResponse(
            account,
        );
    });
}

export async function DELETE(
    request: Request,
    { params }: RouteParams,
) {
    return routeHandler(async () => {
        const { id } =
            await params;

        await deleteBankAccountService(
            id,
        );

        return successResponse({
            success: true,
        });
    });
}
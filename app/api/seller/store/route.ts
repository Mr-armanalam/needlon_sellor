import { NextRequest } from "next/server";

import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { parseBody } from "@/modules/shared/api/parse-body";
import {sellerStoreSchema} from "@/modules/seller-profile/validations/seller-store-schema";
import {updateSellerStoreService,getSellerStore} from "@/modules/seller/services";



export async function GET() {
    return routeHandler(async () => {
        const store =
            await getSellerStore();

        return successResponse(store);
    });
}

export async function PATCH(
    request: NextRequest,
) {
    return routeHandler(async () => {
        const body =
            await parseBody(
                request,
                sellerStoreSchema,
            );

        const store =
            await updateSellerStoreService(
                body,
            );

        return successResponse(store);
    });
}
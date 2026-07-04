
import { NextRequest } from "next/server";
import {routeHandler} from "@/modules/shared/api/route-handler";
import {getSellerProfile, updateSellerProfileService} from "@/modules/seller/services";
import {successResponse} from "@/modules/shared/api/success-response";
import {parseBody} from "@/modules/shared/api/parse-body";
import {sellerProfileSchema} from "@/modules/seller-profile/validations/seller-profile-schema";

export async function GET() {
    return routeHandler(async () => {
        const profile =
            await getSellerProfile();

        return successResponse(profile);
    });
}

export async function PATCH(
    request: NextRequest,
) {
    return routeHandler(async () => {
        const body = await parseBody(
            request,
            sellerProfileSchema,
        );

        const profile =
            await updateSellerProfileService(
                body,
            );

        return successResponse(profile);
    });
}
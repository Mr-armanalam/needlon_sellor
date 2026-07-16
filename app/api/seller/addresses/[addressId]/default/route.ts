import { NextRequest } from "next/server";

import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services";
import {routeHandler} from "@/modules/shared/api/route-handler";
import {setDefaultSellerAddressService} from "@/modules/seller-profile/services/set-default-seller-address.service";
import {successResponse} from "@/modules/shared/api/success-response";


interface RouteContext {
    params: Promise<{
        addressId: string;
    }>;
}

export async function PATCH(
    _: NextRequest,
    { params }: RouteContext,
) {
    return routeHandler(async () => {
        const seller = await getCurrentSellerOrThrow();

        const { addressId } = await params;

        const address = await setDefaultSellerAddressService(
            seller.id,
            addressId,
        );

        return successResponse(address);
    });
}
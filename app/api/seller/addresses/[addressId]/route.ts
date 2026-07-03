import { NextRequest } from "next/server";
import {getCurrentSellerOrThrow} from "@/modules/seller/services";
import {routeHandler} from "@/modules/shared/api/route-handler";
import {parseBody} from "@/modules/shared/api/parse-body";
import {updateSellerAddressSchema} from "@/modules/seller-profile/validations/update-seller-address-schema";
import {updateSellerAddressService} from "@/modules/seller/services/update-seller-address.services";
import {successResponse} from "@/modules/shared/api/success-response";
import {deleteSellerAddressService} from "@/modules/seller/services/delete-seller-address.service";

interface RouteContext {
    params: Promise<{
        addressId: string;
    }>;
}

export async function PATCH(
    request: NextRequest,
    { params }: RouteContext,
) {
    return routeHandler(async () => {
        const seller = await getCurrentSellerOrThrow();

        const { addressId } = await params;

        const body = await parseBody(
            request,
            updateSellerAddressSchema,
        );

        const address = await updateSellerAddressService({
            id: addressId,
            sellerId: seller.id,
            data: body,
        });

        return successResponse(address);
    });
}

export async function DELETE(
    _: NextRequest,
    { params }: RouteContext,
) {
    return routeHandler(async () => {
        const seller = await getCurrentSellerOrThrow();

        const { addressId } = await params;

        await deleteSellerAddressService(
            seller.id,
            addressId,
        );

        return successResponse(null);
    });
}
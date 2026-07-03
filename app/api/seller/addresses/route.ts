import { NextRequest } from "next/server";
import {getCurrentSellerOrThrow, getSellerAddressesService} from "@/modules/seller/services";
import {routeHandler} from "@/modules/shared/api/route-handler";
import {successResponse} from "@/modules/shared/api/success-response";
import {createSellerAddressSchema} from "@/modules/seller-profile/validations/create-seller-address-schema";
import {createSellerAddressService} from "@/modules/seller/services/create-seller-address.services";
import {parseBody} from "@/modules/shared/api/parse-body";


export async function GET() {
    return routeHandler(async () => {
        const seller = await getCurrentSellerOrThrow();

        const addresses = await getSellerAddressesService(
            seller.id,
        );

        return successResponse(addresses);
    });
}

export async function POST(
    request: NextRequest,
) {
    return routeHandler(async () => {
        const seller = await getCurrentSellerOrThrow();

        const body = await parseBody(
            request,
            createSellerAddressSchema,
        );

        const address =
            await createSellerAddressService({
                sellerId: seller.id,
                data: body,
            });

        return successResponse(address, 201);
    });
}
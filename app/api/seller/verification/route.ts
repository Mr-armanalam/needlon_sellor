import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";

import {
    getSellerVerificationService,
} from "@/modules/seller-profile/services";

export async function GET() {
    return routeHandler(async () => {
        const verification =
            await getSellerVerificationService();

        return successResponse(
            verification,
        );
    });
}
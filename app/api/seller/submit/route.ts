import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";

import {
    submitVerificationService,
} from "@/modules/seller/services";

export async function POST() {
    return routeHandler(async () => {
        const verification =
            await submitVerificationService();

        return successResponse(
            verification,
        );
    });
}
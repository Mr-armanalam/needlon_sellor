
import {
    routeHandler,
} from "@/modules/shared/api/route-handler";

import {
    successResponse,
} from "@/modules/shared/api/success-response";

import {
    getSellerProfile,
} from "@/modules/seller-profile/services";

import {
    getReviewMetricsService,
} from "@/modules/review/services";

export async function GET() {
    return routeHandler(
        async () => {
            const profile =
                await getSellerProfile();

            const metrics =
                await getReviewMetricsService(
                    {
                        sellerId:
                        profile.sellerId,
                    },
                );

            return successResponse(
                metrics,
            );
        },
    );
}

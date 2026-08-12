import {
    NextRequest,
} from "next/server";

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
    createReviewResponseService,
} from "@/modules/reviews/services";

import {
    createReviewResponseSchema,
} from "@/modules/reviews/validation/review-response-schema";

export async function POST(
    request: NextRequest,
) {
    return routeHandler(
        async () => {
            const profile =
                await getSellerProfile();

            const body =
                await request.json();

            const parsed =
                createReviewResponseSchema.safeParse(
                    body,
                );

            if (!parsed.success) {
                throw parsed.error;
            }

            const response =
                await createReviewResponseService(
                    {
                        sellerId:
                        profile.id,

                        reviewId:
                        parsed.data.reviewId,

                        content:
                        parsed.data.content,
                    },
                );

            return successResponse(
                response,
            );
        },
    );
}

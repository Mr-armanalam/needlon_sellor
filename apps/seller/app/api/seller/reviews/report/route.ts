import {
    NextRequest,
} from "next/server";
import {routeHandler} from "@/modules/shared/api/route-handler";
import {getSellerProfile} from "@/modules/seller-profile/services";
import {reportReviewSchema} from "@/modules/review/schema/report-review-schema";
import {reportReviewService} from "@/modules/review/services/report-review-service";
import {successResponse} from "@/modules/shared/api/success-response";

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
                reportReviewSchema.safeParse(
                    body,
                );

            if (
                !parsed.success
            ) {
                throw parsed.error;
            }

            const report =
                await reportReviewService({
                    sellerId:
                    profile.sellerId,

                    reviewId:
                    parsed.data.reviewId,

                    reason:
                    parsed.data.reason,
                });

            return successResponse(
                report,
            );
        },
    );
}

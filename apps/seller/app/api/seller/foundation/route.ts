import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import {getSellerFoundationProgressService} from "@/modules/seller-profile/services/get-seller-foundation-progress.service";



export async function GET() {
    return routeHandler(async () => {
        const foundation =
            await getSellerFoundationProgressService();

        return successResponse(
            foundation,
        );
    });
}
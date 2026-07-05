import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import {uploadStoreBannerService} from "@/modules/seller-profile/server/upload-store-banner";

export async function POST(
    request: Request,
) {
    return routeHandler(async () => {
        const formData =
            await request.formData();

        const file =
            formData.get("file");

        if (!(file instanceof File)) {
            throw new Error(
                "Banner image is required.",
            );
        }

        const store =
            await uploadStoreBannerService(
                file,
            );

        return successResponse(store);
    });
}
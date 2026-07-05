import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import {uploadStoreLogoService} from "@/modules/seller-profile/server";



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
                "Logo image is required.",
            );
        }

        const store =
            await uploadStoreLogoService(
                file,
            );

        return successResponse(store);
    });
}
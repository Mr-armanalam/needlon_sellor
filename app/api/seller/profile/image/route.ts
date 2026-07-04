import { NextRequest } from "next/server";

import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import {ValidationError} from "@/modules/shared/errors/validation-error";
import {uploadSellerProfileImage} from "@/modules/seller/services/upload-seller-profile-image";


export async function POST(
    request: NextRequest,
) {
    return routeHandler(async () => {
        const formData =
            await request.formData();

        const file =
            formData.get("file");

        if (!(file instanceof File)) {
            throw new ValidationError(
                "Profile image is required.",
            );
        }

        const profile =
            await uploadSellerProfileImage(
                file,
            );

        return successResponse(profile);
    });
}
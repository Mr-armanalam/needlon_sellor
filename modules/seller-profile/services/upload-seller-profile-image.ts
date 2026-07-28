import { randomUUID } from "crypto";

import { validateProfileImage } from "@/modules/seller-profile/lib/validate-profile-image";
import { PROFILE_IMAGE_BUCKET } from "@/modules/seller-profile/constants";


import { supabaseServer } from "@/lib/supabase/server";
import {getCurrentSellerOrThrow} from "@/modules/seller-profile/services/get-current-seller-or-throw";
import {updateSellerProfile} from "@/modules/seller-profile/repositery";

export async function uploadSellerProfileImage(
    file: File,
) {
    await validateProfileImage(file);

    const seller =
        await getCurrentSellerOrThrow();

    const extension =
        file.name.split(".").pop()?.toLowerCase() ?? "jpg";

    const path =
        `seller/${seller.id}/${randomUUID()}.${extension}`;

    const supabase = supabaseServer;

    const { error } = await supabase.storage
        .from(PROFILE_IMAGE_BUCKET)
        .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        throw error;
    }

    const {
        data: { publicUrl },
    } = supabase.storage
        .from(PROFILE_IMAGE_BUCKET)
        .getPublicUrl(path);

    return updateSellerProfile({
        sellerId: seller.id,
        data: {
            profileImageUrl: publicUrl,
        },
    });
}
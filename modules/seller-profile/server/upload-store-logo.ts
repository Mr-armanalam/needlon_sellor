import { getCurrentSellerOrThrow } from "@/modules/seller/services/get-current-seller-or-throw";

import { validateProfileImage } from "@/modules/seller-profile/lib/validate-profile-image";

import {findSellerStore, updateSellerStore} from "../repositery";

import { toSellerStoreDto } from "../mapper/seller-store-mapper";
import {STORE_IMAGE_BUCKET, STORE_LOGO_PATH} from "@/modules/seller-profile/constants";
import {replaceImage} from "@/modules/shared/storage/replace-image";

export async function uploadStoreLogoService(
    file: File,
) {
    await validateProfileImage(file);

    const seller =
        await getCurrentSellerOrThrow();

    const store =
        await findSellerStore(
            seller.id,
        );

    const logoUrl =
        await replaceImage({
            bucket: STORE_IMAGE_BUCKET,
            folder: `seller/${seller.id}/${STORE_LOGO_PATH}`,
            previousUrl:
            store?.logoUrl,
            file,
        });

    const updated =
        await updateSellerStore({
            sellerId: seller.id,
            data: {
                logoUrl,
            },
        });

    return toSellerStoreDto(updated);
}
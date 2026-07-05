

import { getCurrentSellerOrThrow } from "@/modules/seller/services/get-current-seller-or-throw";
import {UpdateSellerStoreDto} from "@/modules/seller-profile/dto/seller-store.dto";
import {updateSellerStore} from "@/modules/seller-profile/repositery";
import {toSellerStoreDto} from "@/modules/seller-profile/mapper/seller-store-mapper";

export async function updateSellerStoreService(
    data: UpdateSellerStoreDto,
) {
    const seller =
        await getCurrentSellerOrThrow();

    const updated =
        await updateSellerStore({
            sellerId: seller.id,
            data,
        });

    return toSellerStoreDto(
        updated,
    );
}
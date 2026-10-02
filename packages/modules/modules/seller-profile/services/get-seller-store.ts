import { ensureSellerStore } from "./ensure-seller-store";

import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import {toSellerStoreDto} from "@/modules/seller-profile/mapper/seller-store-mapper";

export async function getSellerStore() {
    const seller =
        await getCurrentSellerOrThrow();

    const store =
        await ensureSellerStore(
            seller.id,
        );

    return toSellerStoreDto(
        store,
    );
}
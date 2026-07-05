import { sellerStore } from "@/db/schema/seller/seller-store";

import { SellerStoreDto } from "../dto/seller-store.dto";

type SellerStoreRecord =
    typeof sellerStore.$inferSelect;

export function toSellerStoreDto(
    store: SellerStoreRecord,
): SellerStoreDto {
    return {
        sellerId: store.sellerId,

        storeName: store.storeName,
        storeSlug: store.storeSlug,

        logoUrl: store.logoUrl,
        bannerUrl: store.bannerUrl,

        shortDescription: store.shortDescription,
        description: store.description,

        supportEmail: store.supportEmail,
        supportPhone: store.supportPhone,

        status: store.status,
        visibility: store.visibility,

        isVerified: store.isVerified,

        verifiedAt:
            store.verifiedAt?.toISOString() ??
            null,

        launchedAt:
            store.launchedAt?.toISOString() ??
            null,
    };
}
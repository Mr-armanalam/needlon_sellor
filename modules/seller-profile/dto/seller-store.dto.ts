

import {
    StoreStatus,
    StoreVisibility,
} from "../types/seller-store-form";

export interface SellerStoreDto {
    sellerId: string;

    storeName: string;
    storeSlug: string;

    logoUrl: string | null;
    bannerUrl: string | null;

    shortDescription: string | null;
    description: string | null;

    supportEmail: string | null;
    supportPhone: string | null;

    status: StoreStatus;
    visibility: StoreVisibility;

    isVerified: boolean;

    verifiedAt: string | null;
    launchedAt: string | null;
}

export type UpdateSellerStoreDto =
    Omit<
        SellerStoreDto,
        | "sellerId"
        | "status"
        | "visibility"
        | "isVerified"
        | "verifiedAt"
        | "launchedAt"
    >;
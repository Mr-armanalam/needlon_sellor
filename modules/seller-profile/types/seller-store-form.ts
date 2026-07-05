
import {
    STORE_STATUSES,
    STORE_VISIBILITIES,
} from "../constants";

export type StoreStatus =
    typeof STORE_STATUSES[number];

export type StoreVisibility =
    typeof STORE_VISIBILITIES[number];

export interface SellerStoreForm {
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
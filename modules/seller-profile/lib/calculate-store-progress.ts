import { SellerStoreDto } from "@/modules/seller-profile/dto";

import { FoundationProgressResult } from "./foundation-progress-result";

export function calculateStoreProgress(
    store: SellerStoreDto,
): FoundationProgressResult {
    const missingItems: string[] = [];

    if (!store.storeName) {
        missingItems.push("Store Name");
    }

    if (!store.storeSlug) {
        missingItems.push("Store URL");
    }

    if (!store.logoUrl) {
        missingItems.push("Store Logo");
    }

    if (!store.bannerUrl) {
        missingItems.push("Store Banner");
    }

    if (!store.description) {
        missingItems.push("Description");
    }

    const total = 5;

    const completed =
        total - missingItems.length;

    return {
        progress: Math.round(
            (completed / total) * 100,
        ),

        completed:
            missingItems.length === 0,

        missingItems,
    };
}
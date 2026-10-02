import { SellerAddressDto } from "@/modules/seller-profile/dto";

import { FoundationProgressResult } from "./foundation-progress-result";

export function calculateAddressProgress(
    addresses: SellerAddressDto[],
): FoundationProgressResult {
    const missingItems: string[] = [];

    const hasPickup =
        addresses.some(
            (a) => a.addressType === "PICKUP",
        );

    const hasWarehouse =
        addresses.some(
            (a) => a.addressType === "WAREHOUSE",
        );

    const hasReturn =
        addresses.some(
            (a) => a.addressType === "RETURN",
        );

    if (!hasPickup) {
        missingItems.push("Pickup Address");
    }

    if (!hasWarehouse) {
        missingItems.push("Warehouse Address");
    }

    if (!hasReturn) {
        missingItems.push("Return Address");
    }

    const total = 3;

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
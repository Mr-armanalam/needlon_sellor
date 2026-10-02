import { SellerBankDto } from "@/modules/seller-profile/dto";

import { FoundationProgressResult } from "./foundation-progress-result";

export function calculateBankProgress(
    bank: SellerBankDto | null,
): FoundationProgressResult {
    const missingItems: string[] = [];

    if (!bank) {
        missingItems.push(
            "Bank Account",
        );
    }

    return {
        progress:
            bank ? 100 : 0,

        completed:
            !!bank,

        missingItems,
    };
}
import { SellerVerificationDto } from "@/modules/seller-profile/dto";

import { FoundationProgressResult } from "./foundation-progress-result";

export function calculateVerificationProgress(
    verification: SellerVerificationDto,
): FoundationProgressResult {
    return {
        progress:
        verification.completionPercentage,

        completed:
            verification.verification.status ===
            "VERIFIED",

        missingItems:
            verification.canSubmit
                ? []
                : [
                    "Required verification documents",
                ],
    };
}
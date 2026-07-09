import { SellerProfileDto } from "@/modules/seller-profile/dto";

import { FoundationProgressResult } from "./foundation-progress-result";

export function calculateProfileProgress(
    profile: SellerProfileDto,
): FoundationProgressResult {
    const missingItems: string[] = [];

    if (!profile.displayName) {
        missingItems.push("Full Name");
    }

    if (!profile.phoneNumber) {
        missingItems.push("Phone Number");
    }

    if (!profile.profileImageUrl) {
        missingItems.push("Profile Photo");
    }

    if (!profile.businessName) {
        missingItems.push("Business Name");
    }

    const total = 4;

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
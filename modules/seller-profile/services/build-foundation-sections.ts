

import {
    FoundationData,
} from "./load-foundation-data";
import {calculateProfileProgress} from "@/modules/seller-profile/lib/calculate-profile-progress";
import {calculateStoreProgress} from "@/modules/seller-profile/lib/calculate-store-progress";
import {calculateAddressProgress} from "@/modules/seller-profile/lib/calculate-address-progress";
import {calculateBankProgress} from "@/modules/seller-profile/lib/calculate-bank-progress";
import {calculateVerificationProgress} from "@/modules/seller-profile/lib/calculate-verification-progress";
import {FoundationSectionDto} from "@/modules/seller-profile/dto";
import {FOUNDATION_SECTION_WEIGHTS} from "@/modules/seller-profile/constants";


export function buildFoundationSections(
    data: FoundationData,
): FoundationSectionDto[] {
    const profile =
        calculateProfileProgress(
            data.profile,
        );

    const store =
        calculateStoreProgress(
            data.store,
        );

    const addresses =
        calculateAddressProgress(
            data.addresses,
        );

    const bank =
        calculateBankProgress(
            data.bank,
        );

    const verification =
        calculateVerificationProgress(
            data.verification,
        );

    return [
        {
            id: "profile",

            title:
                "Business Identity",

            progress:
            profile.progress,

            completed:
            profile.completed,

            weight:
            FOUNDATION_SECTION_WEIGHTS.profile,

            missingItems:
            profile.missingItems,

            missingCount:
            profile.missingItems.length,

            route:
                "/seller/foundation?tab=identity",
        },

        {
            id: "store",

            title:
                "Store Management",

            progress:
            store.progress,

            completed:
            store.completed,

            weight:
            FOUNDATION_SECTION_WEIGHTS.store,

            missingItems:
            store.missingItems,

            missingCount:
            store.missingItems.length,

            route:
                "/seller/foundation?tab=store",
        },

        {
            id: "addresses",

            title:
                "Address Management",

            progress:
            addresses.progress,

            completed:
            addresses.completed,

            weight:
            FOUNDATION_SECTION_WEIGHTS.addresses,

            missingItems:
            addresses.missingItems,

            missingCount:
            addresses.missingItems.length,

            route:
                "/seller/foundation?tab=locations",
        },

        {
            id: "bank",

            title:
                "Bank & Payout",

            progress:
            bank.progress,

            completed:
            bank.completed,

            weight:
            FOUNDATION_SECTION_WEIGHTS.bank,

            missingItems:
            bank.missingItems,

            missingCount:
            bank.missingItems.length,

            route:
                "/seller/foundation?tab=payouts",
        },

        {
            id: "verification",

            title:
                "Verification",

            progress:
            verification.progress,

            completed:
            verification.completed,

            weight:
            FOUNDATION_SECTION_WEIGHTS.verification,

            missingItems:
            verification.missingItems,

            missingCount:
            verification.missingItems.length,

            route:
                "/seller/foundation?tab=verification",
        },
    ];
}
import {FOUNDATION_SECTION_ORDER, FoundationSectionId} from "@/modules/seller-profile/constants";
import {FoundationSectionDto, NextFoundationStepDto} from "@/modules/seller-profile/dto";


const SECTION_METADATA: Readonly<
    Record<
        FoundationSectionId,
        Omit<
            NextFoundationStepDto,
            "section"
        >
    >
> = {
    profile: {
        title:
            "Complete Seller Profile",

        description:
            "Finish your business profile to continue onboarding.",

        estimatedMinutes: 2,

        route:
            "/seller/foundation?tab=identity",
    },

    store: {
        title:
            "Complete Store Setup",

        description:
            "Configure your storefront so customers can discover your business.",

        estimatedMinutes: 3,

        route:
            "/seller/foundation?tab=store",
    },

    addresses: {
        title:
            "Add Business Addresses",

        description:
            "Configure pickup, warehouse and return addresses.",

        estimatedMinutes: 3,

        route:
            "/seller/foundation?tab=locations",
    },

    bank: {
        title:
            "Setup Bank & Payout",

        description:
            "Add your payout account to receive settlements.",

        estimatedMinutes: 2,

        route:
            "/seller/foundation?tab=payouts",
    },

    verification: {
        title:
            "Complete Verification",

        description:
            "Upload required documents and submit them for verification.",

        estimatedMinutes: 5,

        route:
            "/seller/foundation?tab=verification",
    },
};

interface GetNextFoundationStepInput {
    sections: FoundationSectionDto[];
}

export function getNextFoundationStep({
                                          sections,
                                      }: GetNextFoundationStepInput): NextFoundationStepDto | null {
    const sectionMap = new Map(
        sections.map(
            (section) => [
                section.id,
                section,
            ],
        ),
    );

    for (const sectionId of FOUNDATION_SECTION_ORDER) {
        const section =
            sectionMap.get(
                sectionId,
            );

        if (
            !section ||
            section.completed
        ) {
            continue;
        }

        return {
            section: sectionId,

            ...SECTION_METADATA[
                sectionId
                ],
        };
    }

    return null;
}
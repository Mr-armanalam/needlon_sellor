

import {
    loadFoundationData,
} from "./load-foundation-data";

import {
    buildFoundationSections,
} from "./build-foundation-sections";

import {
    calculateFoundationProgress,
} from "./calculate-foundation-progress";

import {
    getNextFoundationStep,
} from "./get-next-foundation-step";
import {SellerFoundationProgressDto} from "@/modules/seller-profile/dto";

export async function getSellerFoundationProgressService(): Promise<SellerFoundationProgressDto> {
    const data =
        await loadFoundationData();

    const sections =
        buildFoundationSections(
            data,
        );

    const progress =
        calculateFoundationProgress({
            sections,
        });

    const nextStep =
        getNextFoundationStep({
            sections,
        });

    return {
        percentage:
        progress.percentage,

        completedSections:
        progress.completedSections,

        totalSections:
        progress.totalSections,

        sellerReady:
        progress.sellerReady,

        nextStep,

        sections,
    };
}
import {FoundationSectionDto} from "@/modules/seller-profile/dto";
import {FOUNDATION_SECTION_WEIGHTS, FOUNDATION_TOTAL_WEIGHT} from "@/modules/seller-profile/constants";


interface CalculateFoundationProgressInput {
    sections: FoundationSectionDto[];
}

export function calculateFoundationProgress({
                                                sections,
                                            }: CalculateFoundationProgressInput) {
    let weightedProgress = 0;

    let completedSections = 0;

    for (const section of sections) {
        weightedProgress +=
            (section.progress / 100) *
            FOUNDATION_SECTION_WEIGHTS[
                section.id
                ];

        if (section.completed) {
            completedSections++;
        }
    }

    const percentage = Math.round(
        (weightedProgress /
            FOUNDATION_TOTAL_WEIGHT) *
        100,
    );

    return {
        percentage,

        completedSections,

        totalSections:
        sections.length,

        sellerReady:
            completedSections ===
            sections.length,
    };
}
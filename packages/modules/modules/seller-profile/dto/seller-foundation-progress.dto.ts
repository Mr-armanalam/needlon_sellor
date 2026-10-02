import {
    FoundationSectionDto,
} from "./foundation-section.dto";

import {
    NextFoundationStepDto,
} from "./next-foundation-step.dto";

export interface SellerFoundationProgressDto {
    percentage: number;

    completedSections: number;

    totalSections: number;

    sellerReady: boolean;

    nextStep: NextFoundationStepDto | null;

    sections: FoundationSectionDto[];
}
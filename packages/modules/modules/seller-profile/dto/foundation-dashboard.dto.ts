import { FoundationActivityDto } from "./foundation-activity.dto";
import { FoundationSectionDto } from "./foundation-section.dto";
import { NextFoundationStepDto } from "./next-foundation-step.dto";
import { QuickActionDto } from "./quick-action.dto";

export interface SellerFoundationDashboardDto {
    sellerName: string;

    completionPercentage: number;

    completedSections: number;

    totalSections: number;

    sellerReady: boolean;

    nextStep: NextFoundationStepDto | null;

    sections: FoundationSectionDto[];

    quickActions: QuickActionDto[];

    recentActivities: FoundationActivityDto[];
}
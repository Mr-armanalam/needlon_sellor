import {FoundationSectionId} from "@/modules/seller-profile/constants";


export interface NextFoundationStepDto {
    section: FoundationSectionId;

    title: string;

    description: string;

    estimatedMinutes: number;

    route: string;
}
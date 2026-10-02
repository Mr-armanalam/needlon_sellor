import {FoundationSectionId} from "@/modules/seller-profile/constants";


export interface FoundationSectionDto {
    id: FoundationSectionId;

    title: string;

    completed: boolean;

    progress: number;

    weight: number;

    missingItems: string[];

    missingCount: number;

    route: string;
}
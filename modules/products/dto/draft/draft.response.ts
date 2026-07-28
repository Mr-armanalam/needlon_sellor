import {productStatusEnum} from "@/db/schema/catalog/enums";

export interface DraftResponse {
    id: string;

    status: typeof productStatusEnum.enumValues[number];

    currentStep: number;

    completedSteps: number[];

    createdAt: Date;

    updatedAt: Date;
}
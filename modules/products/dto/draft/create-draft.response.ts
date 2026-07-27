import {productStatusEnum} from "@/db/schema/catalog/enums";

export interface CreateDraftResponse {
    id: string;

    status: typeof productStatusEnum.enumValues[number];

    currentStep: number;

    completedSteps: number[];

    createdAt: Date;

    updatedAt: Date;
}
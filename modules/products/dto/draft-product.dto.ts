import { productStatusEnum } from "@/db/schema/catalog/enums";

export interface CreateDraftRequest {
    storeId: string;
    sellerId: string;
    status?: typeof productStatusEnum.enumValues[number];
}

export interface UpdateDraftRequest {
    currentStep?: number;
    completedSteps?: number[];
}

export interface CreateDraftResponse {
    id: string;
    status: typeof productStatusEnum.enumValues[number];
    currentStep: number;
    completedSteps: number[];
    createdAt: Date;
    updatedAt: Date;
}

export interface DraftResponse {
    id: string;
    status: typeof productStatusEnum.enumValues[number];
    currentStep: number;
    completedSteps: number[];
    createdAt: Date;
    updatedAt: Date;
}

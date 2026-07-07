import { apiClient } from "@/modules/shared/api/api-client";

import {
    SellerBankAccountDto,
    SellerBankDto,
} from "../dto";

interface CreateBankAccountRequest {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName?: string;
    accountType: string;
}

interface UpdateBankAccountRequest {
    accountHolderName: string;
    bankName: string;
    ifscCode: string;
    branchName?: string;
    accountType: string;
}

export const sellerBankApi = {
    get() {
        return apiClient.get<SellerBankDto>(
            "/api/seller/bank",
        );
    },

    create(
        body: CreateBankAccountRequest,
    ) {
        return apiClient.post<
            SellerBankAccountDto,
            CreateBankAccountRequest
        >(
            "/api/seller/bank",
            body,
        );
    },

    update(
        accountId: string,
        body: UpdateBankAccountRequest,
    ) {
        return apiClient.patch<
            SellerBankAccountDto,
            UpdateBankAccountRequest
        >(
            `/api/seller/bank/${accountId}`,
            body,
        );
    },

    delete(accountId: string) {
        return apiClient.delete<void>(
            `/api/seller/bank/${accountId}`,
        );
    },

    setPrimary(accountId: string) {
        return apiClient.post<
            SellerBankAccountDto
        >(
            `/api/seller/bank/${accountId}/primary`,
        );
    },
};
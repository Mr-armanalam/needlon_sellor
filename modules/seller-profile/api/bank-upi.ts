import { apiClient } from "@/modules/shared/api/api-client";

import {
    SellerBankAccountDto,
} from "../dto";

interface AddUPI_ID_Request {
    accountId: string;
    upiId: string;
}


export const sellerUPI_Api = {

    set(
        body: AddUPI_ID_Request,
    ) {
        return apiClient.post<
            SellerBankAccountDto,
            AddUPI_ID_Request
        >(
            "/api/seller/bank/upi",
            body,
        );
    },


    delete(accountId: string) {
        return apiClient.delete<void>(
            `/api/seller/bank/upi/${accountId}`,
        );
    },

};
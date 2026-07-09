import { apiClient } from "@/modules/shared/api/api-client";

import {
    SellerFoundationProgressDto,
} from "../dto";

export const sellerFoundationApi = {
    getProgress() {
        return apiClient.get<SellerFoundationProgressDto>(
            "/api/seller/foundation",
        );
    },
};
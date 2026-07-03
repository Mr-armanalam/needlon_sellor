
import {apiClient} from "@/modules/shared/api/api-client";
import {CreateSellerAddressDto, SellerAddressDto, UpdateSellerAddressDto} from "@/modules/seller-profile/dto";

const BASE_URL = "/api/seller/addresses";

export const sellerAddressApi = {
    getAll() {
        return apiClient.get<SellerAddressDto[]>(BASE_URL);
    },

    create(input: CreateSellerAddressDto) {
        return apiClient.post<SellerAddressDto>(BASE_URL, input);
    },

    update(input: UpdateSellerAddressDto) {
        return apiClient.patch<SellerAddressDto>(
            `${BASE_URL}/${input.id}`,
            input.data,
        );
    },

    delete(id: string) {
        return apiClient.delete<void>(
            `${BASE_URL}/${id}`,
        );
    },

    setDefault(id: string) {
        return apiClient.patch<void>(
            `${BASE_URL}/${id}/default`,
        );
    },
};
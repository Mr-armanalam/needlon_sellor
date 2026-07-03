import {apiClient} from "@/modules/shared/api";

export async function deleteSellerAddress(
    id: string,
) {
    return apiClient.delete<void>(
        `/seller/addresses/${id}`,
    );
}
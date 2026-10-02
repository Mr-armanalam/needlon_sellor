import {createSellerStore, findSellerStore} from "@/modules/seller-profile/repositery";


export async function ensureSellerStore(
    sellerId: string,
) {
    const existing =
        await findSellerStore(
            sellerId,
        );

    if (existing) {
        return existing;
    }

    return createSellerStore(
        sellerId,
    );
}
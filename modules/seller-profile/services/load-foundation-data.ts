import {
    getCurrentSellerOrThrow,
    getSellerAddressesService,
    getSellerProfile,
    getSellerStore
} from "@/modules/seller-profile/services/index";


import {
    getSellerBankService,
} from "@/modules/seller-profile/services/get-seller-bank.service";

import {
    getSellerVerificationService,
} from "@/modules/seller-profile/services/get-seller-verification.service";

export interface FoundationData {
    profile: Awaited<
        ReturnType<
            typeof getSellerProfile
        >
    >;

    store: Awaited<
        ReturnType<
            typeof getSellerStore
        >
    >;

    addresses: Awaited<
        ReturnType<
            typeof getSellerAddressesService
        >
    >;

    bank: Awaited<
        ReturnType<
            typeof getSellerBankService
        >
    >;

    verification: Awaited<
        ReturnType<
            typeof getSellerVerificationService
        >
    >;
}

export async function loadFoundationData(): Promise<FoundationData> {
    /**
     * Ensure authenticated seller exists.
     * Downstream services should use the same seller context.
     */
    const seller = await getCurrentSellerOrThrow();

    const [
        profile,
        store,
        addresses,
        bank,
        verification,
    ] = await Promise.all([
        getSellerProfile(),
        getSellerStore(),
        getSellerAddressesService(seller.id),
        getSellerBankService(),
        getSellerVerificationService(),
    ]);

    return {
        profile,
        store,
        addresses,
        bank,
        verification,
    };
}
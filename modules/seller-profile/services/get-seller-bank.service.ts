
import {
    SellerBankDto,
} from "../dto";

import {
    listBankAccounts,
} from "../repositery";
import {toSellerBankDto} from "@/modules/seller-profile/mapper/seller-bank.mapper";
import {getCurrentSellerOrThrow} from "@/modules/seller-profile/services/get-current-seller-or-throw";

export async function getSellerBankService(): Promise<SellerBankDto> {
    const seller =
        await getCurrentSellerOrThrow();

    const accounts =
        await listBankAccounts({
            sellerId: seller?.id,
        });

    return toSellerBankDto({
        accounts,
    });
}
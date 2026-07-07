
import {
    SellerBankDto,
} from "../../seller-profile/dto";

import {
    listBankAccounts,
} from "../../seller-profile/repositery";
import {toSellerBankDto} from "@/modules/seller-profile/mapper/seller-bank.mapper";
import {getCurrentSellerOrThrow} from "@/modules/seller/services/get-current-seller-or-throw";

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
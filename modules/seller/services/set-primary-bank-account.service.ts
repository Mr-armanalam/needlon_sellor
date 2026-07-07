
import {
    findBankAccount,
    setPrimaryBankAccount,
} from "../../seller-profile/repositery";

import {
    toSellerBankAccountDto,
} from "../../seller-profile/mapper/seller-bank-account.mapper";
import {getCurrentSellerOrThrow} from "@/modules/seller/services/get-current-seller-or-throw";

export async function setPrimaryBankAccountService(
    accountId: string,
) {
    const {id:sellerId} =
        await getCurrentSellerOrThrow();

    const account =
        await findBankAccount({
            sellerId,
            accountId,
        });

    if (!account) {
        throw new Error(
            "Bank account not found.",
        );
    }

    if (!account.isActive) {
        throw new Error(
            "Inactive bank account cannot be set as primary.",
        );
    }

    if (account.deletedAt) {
        throw new Error(
            "Bank account not found.",
        );
    }

    if (account.isPrimary) {
        return toSellerBankAccountDto(
            account,
        );
    }

    const updated =
        await setPrimaryBankAccount({
            sellerId,
            accountId,
        });

    return toSellerBankAccountDto(
        updated!,
    );
}

import {
    findBankAccount,
    setPrimaryBankAccount,
} from "../repositery";

import {
    toSellerBankAccountDto,
} from "../mapper/seller-bank-account.mapper";
import {getCurrentSellerOrThrow} from "@/modules/seller-profile/services/get-current-seller-or-throw";

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
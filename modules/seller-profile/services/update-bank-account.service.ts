
import {
    findBankAccount, listBankAccounts,
    updateBankAccount,
} from "../repositery";

import {
    AccountType,
} from "../types/account-type";
import {toSellerBankAccountDto} from "@/modules/seller-profile/mapper/seller-bank-account.mapper";
import {getCurrentSellerOrThrow} from "@/modules/seller-profile/services/get-current-seller-or-throw";
import {validateBankAccount} from "@/modules/seller-profile/lib/validate-bank-account";

interface UpdateBankAccountInput {
    accountId: string;

    accountHolderName: string;

    bankName: string;

    ifscCode: string;

    branchName?: string;

    accountType: AccountType;
    accountNumber: string;
}

export async function updateBankAccountService(
    input: UpdateBankAccountInput,
) {
    const values =
        validateBankAccount({
            ...input,
            confirmAccountNumber:
            input.accountNumber,
        });

    const seller =
        await getCurrentSellerOrThrow();

    const existing =
        await findBankAccount({
            sellerId: seller.id,
            accountId:
            input.accountId,
        });

    if (!existing) {
        throw new Error(
            "Bank account not found.",
        );
    }

    const accounts =
        await listBankAccounts({
            sellerId: seller.id,
        });

    const duplicate =
        accounts.find(
            (account) =>
                account.id !==
                input.accountId &&
                account.accountNumberLast4 ===
                values.accountNumber.slice(-4) &&
                account.ifscCode ===
                values.ifscCode,
        );

    if (duplicate) {
        throw new Error(
            "Duplicate bank account.",
        );
    }

    const updated =
        await updateBankAccount({
            sellerId: seller.id,

            accountId:
            input.accountId,

            values: {
                accountHolderName:
                input.accountHolderName,

                bankName:
                input.bankName,

                ifscCode:
                input.ifscCode,

                branchName:
                input.branchName,

                accountType:
                input.accountType,
            },
        });

    return toSellerBankAccountDto(
        updated!,
    );
}
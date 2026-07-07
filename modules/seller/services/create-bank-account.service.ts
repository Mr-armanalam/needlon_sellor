
import {
    createBankAccount,
    listBankAccounts,
} from "../../seller-profile/repositery";
import {AccountType} from "@/modules/seller-profile/types/account-type";
import {toSellerBankAccountDto} from "@/modules/seller-profile/mapper/seller-bank-account.mapper";
import {getCurrentSellerOrThrow} from "@/modules/seller/services/get-current-seller-or-throw";
import {MAX_BANK_ACCOUNTS} from "@/modules/seller-profile/constants";
import {validateBankAccount} from "@/modules/seller-profile/lib/validate-bank-account";
import {encryptBankAccount} from "@/modules/seller-profile/lib/encrypt-bank-account";



interface CreateBankAccountInput {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    accountNumberLast4: string;
    ifscCode: string;
    branchName?: string;
    accountType: AccountType;
}

export async function createBankAccountService(
    input: CreateBankAccountInput,
) {


    const values =
        validateBankAccount(input);

    const seller =
        await getCurrentSellerOrThrow();

    const accounts =
        await listBankAccounts({
            sellerId: seller.id,
        });

    if (
        accounts.length >=
        MAX_BANK_ACCOUNTS
    ) {
        throw new Error(
            "Maximum bank accounts reached.",
        );
    }

    const duplicate =
        accounts.find(
            (account) =>
                account.accountNumberLast4 ===
                values.accountNumber.slice(-4) &&
                account.ifscCode ===
                values.ifscCode,
        );

    if (duplicate) {
        throw new Error(
            "This bank account already exists.",
        );
    }

    const account =
        await createBankAccount({
            sellerId: seller.id,

            accountHolderName:
            values.accountHolderName,

            bankName:
            values.bankName,

            accountNumber:
                await encryptBankAccount(
                    values.accountNumber,
                ),// encrypt later

            accountNumberLast4:
                values.accountNumber.slice(-4),

            ifscCode:
            values.ifscCode,

            branchName:
            values.branchName,

            accountType:
            values.accountType,

            isPrimary:
                accounts.length === 0,
        });

    return toSellerBankAccountDto(
        account,
    );
}
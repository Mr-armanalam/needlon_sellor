import {
    SellerBankDto,
} from "../dto";

import {
    toSellerBankAccountDto,
} from "./seller-bank-account.mapper";
import {sellerBankAccounts} from "@/db/schema/seller/seller-bank-account";


type SellerBankAccountRecord =
    typeof sellerBankAccounts.$inferSelect;

interface Params {
    accounts: SellerBankAccountRecord[];
}

export function toSellerBankDto({
                                    accounts,
                                }: Params): SellerBankDto {
    const bankAccounts =
        accounts.map(
            toSellerBankAccountDto,
        );

    const primaryAccount =
        bankAccounts.find(
            (account) =>
                account.isPrimary,
        ) ?? null;

    const verifiedAccounts =
        bankAccounts.filter(
            (account) =>
                account.verificationStatus ===
                "VERIFIED",
        ).length;

    return {
        accounts: bankAccounts,

        primaryAccount,

        verifiedAccounts,

        totalAccounts:
        bankAccounts.length,

        hasVerifiedAccount:
            verifiedAccounts > 0,

        canReceivePayouts:
            primaryAccount !== null &&
            primaryAccount.verificationStatus ===
            "VERIFIED",
    };
}
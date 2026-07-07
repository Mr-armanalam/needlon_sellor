import { SellerBankAccountDto } from "./seller-bank-account.dto";

export interface SellerBankDto {
    accounts: SellerBankAccountDto[];

    primaryAccount: SellerBankAccountDto | null;

    verifiedAccounts: number;

    totalAccounts: number;

    hasVerifiedAccount: boolean;

    canReceivePayouts: boolean;
}
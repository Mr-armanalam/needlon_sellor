import {
    AccountType,
    BankVerificationMethod,
    BankVerificationStatus,
} from "../types/";

export interface SellerBankAccountDto {
    id: string;

    sellerId: string;

    accountHolderName: string;

    bankName: string;

    accountNumberLast4: string;

    ifscCode: string;

    branchName: string | null;

    accountType: AccountType;
    upiId : string | null;

    verificationStatus: BankVerificationStatus;

    verificationMethod: BankVerificationMethod;

    verifiedAt: string | null;

    isPrimary: boolean;

    isActive: boolean;

    notes: string | null;

    createdAt: string;

    updatedAt: string;
}
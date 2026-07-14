import {sellerBankAccounts} from "@/db/schema/seller/seller-bank-account";

type SellerBankAccountRecord =
    typeof sellerBankAccounts.$inferSelect;

export function toSellerBankAccountDto(
    account: SellerBankAccountRecord,
) {
    return {
        id: account.id,

        sellerId: account.sellerId,

        accountHolderName:
        account.accountHolderName,

        bankName:
        account.bankName,

        accountNumberLast4:
        account.accountNumberLast4,

        ifscCode:
        account.ifscCode,

        branchName:
        account.branchName,

        accountType:
        account.accountType,

        upiId : account.upiId,

        verificationStatus:
        account.verificationStatus,

        verificationMethod:
        account.verificationMethod,

        verifiedAt:
            account.verifiedAt?.toISOString() ??
            null,

        isPrimary:
        account.isPrimary,

        isActive:
        account.isActive,

        notes:
        account.notes,

        createdAt:
            account.createdAt.toISOString(),

        updatedAt:
            account.updatedAt.toISOString(),
    };
}
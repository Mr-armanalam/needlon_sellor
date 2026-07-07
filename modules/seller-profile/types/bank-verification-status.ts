import {bankVerificationStatusEnum} from "@/db/schema/seller/seller-bank-account";


export const BankVerificationStatus =
    bankVerificationStatusEnum.enumValues.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            (typeof bankVerificationStatusEnum.enumValues)[number],
            (typeof bankVerificationStatusEnum.enumValues)[number]
        >,
    );

export type BankVerificationStatus =
    keyof typeof BankVerificationStatus;
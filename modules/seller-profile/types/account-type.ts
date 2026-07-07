import {accountTypeEnum} from "@/db/schema/seller/seller-bank-account";


export const AccountType =
    accountTypeEnum.enumValues.reduce(
        (acc, value) => {
            acc[value] = value;
            return acc;
        },
        {} as Record<
            (typeof accountTypeEnum.enumValues)[number],
            (typeof accountTypeEnum.enumValues)[number]
        >,
    );

export type AccountType =
    keyof typeof AccountType;
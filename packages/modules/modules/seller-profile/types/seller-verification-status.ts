import {
    sellerVerificationStatusEnum,
} from "@/db/schema/seller/seller-verification";

export const SellerVerificationStatus =
    Object.fromEntries(
        sellerVerificationStatusEnum.enumValues.map(
            (value) => [value, value],
        ),
    ) as Record<
        (typeof sellerVerificationStatusEnum.enumValues)[number],
        (typeof sellerVerificationStatusEnum.enumValues)[number]
    >;

export type SellerVerificationStatus =
    keyof typeof SellerVerificationStatus;
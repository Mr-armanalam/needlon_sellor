import {
    sellerDocumentStatusEnum,
} from "@/db/schema/seller/seller-document";

export const DocumentStatus =
    Object.fromEntries(
        sellerDocumentStatusEnum.enumValues.map(
            (value) => [value, value],
        ),
    ) as Record<
        (typeof sellerDocumentStatusEnum.enumValues)[number],
        (typeof sellerDocumentStatusEnum.enumValues)[number]
    >;

export type DocumentStatus =
    keyof typeof DocumentStatus;
import { pgEnum } from "drizzle-orm/pg-core";

export const catalogStatusEnum = pgEnum(
    "catalog_status",
    [
        "ACTIVE",
        "INACTIVE",
    ],
);

export type CatalogStatus =
    (typeof catalogStatusEnum.enumValues)[number];
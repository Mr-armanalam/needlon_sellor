import { createCatalogBaseSchema } from "./create-catalog-base";

export const updateCatalogBaseSchema =
    createCatalogBaseSchema
        .partial();
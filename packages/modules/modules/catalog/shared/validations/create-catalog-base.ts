import { z } from "zod";

import {
    catalogDescriptionSchema,
    catalogNameSchema,
    catalogSortOrderSchema,
    catalogStatusSchema,
} from ".";

export const createCatalogBaseSchema =
    z.object({

        name:
        catalogNameSchema,

        description:
        catalogDescriptionSchema,

        status:
        catalogStatusSchema,

        sortOrder:
        catalogSortOrderSchema,

    });
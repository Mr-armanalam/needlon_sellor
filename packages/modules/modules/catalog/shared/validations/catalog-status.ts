import { z } from "zod";

import {
    catalogStatusEnum,
} from "@/db/schema/catalog/enums";

export const catalogStatusSchema =
    z.enum(
        catalogStatusEnum.enumValues,
    );
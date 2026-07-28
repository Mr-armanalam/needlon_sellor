import { z } from "zod";

import {
    MAX_SORT_ORDER,
} from "../constants";

export const catalogSortOrderSchema =
    z
        .number()
        .int()
        .min(0)
        .max(MAX_SORT_ORDER);
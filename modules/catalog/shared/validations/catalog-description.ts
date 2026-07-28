import { z } from "zod";

import {
    MAX_DESCRIPTION_LENGTH,
} from "../constants";

export const catalogDescriptionSchema =
    z
        .string()
        .trim()
        .max(
            MAX_DESCRIPTION_LENGTH,
        )
        .optional();
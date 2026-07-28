import { z } from "zod";

import {
    MAX_SLUG_LENGTH,
} from "../constants";

export const catalogSlugSchema =
    z
        .string()
        .trim()
        .max(MAX_SLUG_LENGTH)
        .regex(
            /^[a-z0-9-]+$/,
            "Invalid slug.",
        );
import { z } from "zod";

import {
    MAX_NAME_LENGTH,
    MIN_NAME_LENGTH,
} from "../constants";

export const catalogNameSchema =
    z
        .string()
        .trim()
        .min(
            MIN_NAME_LENGTH,
            "Name is too short.",
        )
        .max(
            MAX_NAME_LENGTH,
            `Name cannot exceed ${MAX_NAME_LENGTH} characters.`,
        );
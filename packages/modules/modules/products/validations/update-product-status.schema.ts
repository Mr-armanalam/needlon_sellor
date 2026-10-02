import { z } from "zod";

export const updateProductStatusSchema =
    z.object({
        status: z.string(),
    });
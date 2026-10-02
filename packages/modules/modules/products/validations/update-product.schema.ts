import { z } from "zod";
import { createProductSchema } from "./create-product.schema";

export const updateProductSchema =
    createProductSchema.partial();

export type UpdateProductInput =
    z.infer<typeof updateProductSchema>;
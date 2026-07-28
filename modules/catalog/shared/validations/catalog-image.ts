import { z } from "zod";

export const catalogImageSchema =
    z.instanceof(File)
        .optional();
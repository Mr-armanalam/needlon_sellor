import { z, ZodTypeAny } from "zod";
import {ValidationError} from "@/modules/shared/errors/validation-error";


export async function validate<T extends ZodTypeAny>(
    schema: T,
    value: unknown,
): Promise<z.infer<T>> {
    const result = schema.safeParse(value);

    if (!result.success) {
        throw new ValidationError(
            "Request validation failed.",
            result.error.flatten(),
        );
    }

    return result.data;
}
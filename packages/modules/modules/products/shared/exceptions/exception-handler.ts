import { ZodError } from "zod";

import {
    AppError,
    ValidationError,
} from "@/modules/shared/errors";

import { DatabaseException } from "./database.exception";

export function handleException(
    error: unknown,
): never {

    if (error instanceof AppError) {
        throw error;
    }

    if (error instanceof ZodError) {
        throw new ValidationError(
            "Validation failed.",
            error.flatten(),
        );
    }

    if (
        error instanceof Error &&
        "code" in error
    ) {
        const code = String(
            (error as { code?: unknown }).code,
        );

        switch (code) {
            case "23505":
                throw new DatabaseException(
                    "Duplicate record.",
                );

            case "23503":
                throw new DatabaseException(
                    "Referenced record does not exist.",
                );

            case "23502":
                throw new DatabaseException(
                    "Required field missing.",
                );

            default:
                break;
        }
    }

    console.error(error);

    throw new DatabaseException();
}
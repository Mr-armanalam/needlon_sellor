import { AppError } from "@/modules/shared/errors";

export class ValidationException extends AppError {
    constructor(
        message = "Request validation failed.",
        public readonly details?: unknown,
    ) {
        super(
            message,
            400,
            "VALIDATION_EXCEPTION",
        );
    }
}
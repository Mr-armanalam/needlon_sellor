import { AppError } from "@/modules/shared/errors";

export class DatabaseException extends AppError {
    constructor(
        message = "Database operation failed.",
    ) {
        super(
            message,
            500,
            "DATABASE_ERROR",
        );
    }
}
import { AppError } from "@/modules/shared/errors";

export class RepositoryError extends AppError {
    constructor(
        message: string,
    ) {
        super(
            message,
            500,
            "REPOSITORY_ERROR",
        );
    }
}
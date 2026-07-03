import { AppError } from "./app-error";

export class UnauthorizedError extends AppError {
    constructor() {
        super(
            "Authentication required.",
            401,
            "UNAUTHORIZED",
        );
    }
}
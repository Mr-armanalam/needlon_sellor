import {AppError} from "@/modules/shared/errors/app-error";

export class ForbiddenError extends AppError {
    constructor(message: string = "Forbidden Error") {
        super(message, 403,'FORBIDDEN_ERROR');
    }
}
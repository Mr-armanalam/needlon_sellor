import {AppError} from "@/modules/shared/errors/app-error";

export class BadRequestError extends AppError {
    constructor(message: string = "Bad Request Error") {
        super(message, 400, 'BAD_REQUEST');
    }
}
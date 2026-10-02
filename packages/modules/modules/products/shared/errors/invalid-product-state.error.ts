import { ValidationError } from "@/modules/shared/errors";

export class InvalidProductStateError extends ValidationError {
    constructor(
        message: string,
    ) {
        super(message);
    }
}
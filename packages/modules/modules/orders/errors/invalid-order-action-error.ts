import { BadRequestError } from "@/modules/shared/errors/bad-request-error";

export class InvalidOrderActionError extends BadRequestError {
    constructor(message: string) {
        super(message);
    }
}

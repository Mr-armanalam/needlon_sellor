import {NotFoundError} from "@/modules/shared/errors/not-found-error";

export class AddressNotFoundError extends NotFoundError {
    constructor() {
        super("Address not found.");
    }
}
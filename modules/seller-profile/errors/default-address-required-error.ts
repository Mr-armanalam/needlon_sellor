import {ConflictError} from "@/modules/shared/errors/conflict-error";

export class DefaultAddressRequiredError extends ConflictError {
    constructor() {
        super(
            "A seller must always have one default address.",
        );
    }
}
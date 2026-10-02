import { NotFoundError } from "@/modules/shared/errors";

export class VariantNotFoundError extends NotFoundError {
    constructor() {
        super("Variant not found.");
    }
}
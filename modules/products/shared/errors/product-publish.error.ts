import { ValidationError } from "@/modules/shared/errors";

export class ProductPublishError extends ValidationError {
    constructor(
        reason: string,
    ) {
        super(reason);
    }
}
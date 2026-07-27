import { ConflictError } from "@/modules/shared/errors";

export class DuplicateSkuError extends ConflictError {
    constructor(
        sku: string,
    ) {
        super(
            `SKU "${sku}" already exists.`,
        );
    }
}
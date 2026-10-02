import { ConflictError } from "@/modules/shared/errors";

export class ProductSlugConflictError extends ConflictError {
    constructor() {
        super("A product with this slug already exists.");
    }
}
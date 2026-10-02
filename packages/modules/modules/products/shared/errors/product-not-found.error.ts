import { NotFoundError } from "@/modules/shared/errors";

export class ProductNotFoundError extends NotFoundError {
    constructor() {
        super("Product not found.");
    }
}
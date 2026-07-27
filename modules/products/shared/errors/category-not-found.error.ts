import { NotFoundError } from "@/modules/shared/errors";

export class CategoryNotFoundError extends NotFoundError {
    constructor() {
        super("Category not found.");
    }
}
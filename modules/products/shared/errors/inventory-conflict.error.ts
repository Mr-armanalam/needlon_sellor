import { ConflictError } from "@/modules/shared/errors";

export class InventoryConflictError extends ConflictError {
    constructor() {
        super(
            "Inventory has been modified by another process.",
        );
    }
}
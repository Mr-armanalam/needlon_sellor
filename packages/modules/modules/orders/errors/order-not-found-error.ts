import { NotFoundError } from "@/modules/shared/errors/not-found-error";

export class OrderNotFoundError extends NotFoundError {
    constructor(orderId: string) {
        super(`Order with ID ${orderId} not found.`);
    }
}

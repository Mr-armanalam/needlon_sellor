import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { UnauthorizedError } from "@/modules/shared/errors/unauthorised-error";

export class UnauthorizedSellerError extends UnauthorizedError {
    constructor() {
        super();
        this.name = "UnauthorizedSellerError";
    }
}

export async function getCurrentSellerOrThrow() {
    const seller = await getCurrentSeller();

    if (!seller) {
        throw new UnauthorizedSellerError();
    }

    return seller;
}

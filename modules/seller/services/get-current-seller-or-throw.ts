import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";

export class UnauthorizedSellerError extends Error {
    constructor() {
        super("Unauthorized");
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
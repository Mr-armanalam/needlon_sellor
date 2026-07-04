import {NotFoundError} from "@/modules/shared/errors/not-found-error";

export class SellerProfileNotFoundError
    extends NotFoundError {
    constructor() {
        super(
            "Seller profile not found.",
            // "SELLER_PROFILE_NOT_FOUND",
        );
    }
}
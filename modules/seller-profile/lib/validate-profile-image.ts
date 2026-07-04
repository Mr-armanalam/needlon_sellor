import {ALLOWED_PROFILE_IMAGE_TYPES, MAX_PROFILE_IMAGE_SIZE} from "@/modules/seller-profile/constants";
import {ValidationError} from "@/modules/shared/errors/validation-error";


export function validateProfileImage(
    file: File,
) {
    if (
        !ALLOWED_PROFILE_IMAGE_TYPES.includes(
            file.type as never,
        )
    ) {
        throw new ValidationError(
            "Unsupported image format.",
        );
    }

    if (
        file.size >
        MAX_PROFILE_IMAGE_SIZE
    ) {
        throw new ValidationError(
            "Image size exceeds 5 MB.",
        );
    }
}
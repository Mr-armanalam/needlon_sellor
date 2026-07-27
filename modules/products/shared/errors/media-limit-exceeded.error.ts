import { ValidationError } from "@/modules/shared/errors";

export class MediaLimitExceededError extends ValidationError {
    constructor(
        limit: number,
    ) {
        super(
            `Maximum ${limit} media files are allowed.`,
        );
    }
}
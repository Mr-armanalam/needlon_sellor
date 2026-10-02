import { AppError } from "@/modules/shared/errors";

export class MapperException extends AppError {
    constructor(
        message = "Unable to map entity.",
    ) {
        super(
            message,
            500,
            "MAPPER_ERROR",
        );
    }
}
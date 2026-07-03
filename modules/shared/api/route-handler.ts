import { errorResponse } from "./error-response";

export async function routeHandler<T>(
    handler: () => Promise<T>,
) {
    try {
        return await handler();
    } catch (error) {
        return errorResponse(error);
    }
}
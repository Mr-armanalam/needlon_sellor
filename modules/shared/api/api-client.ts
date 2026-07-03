import { ApiError } from "./api-error";
import {
    ApiErrorResponse,
    ApiResponse,
    ApiSuccessResponse,
} from "./api-response";
import { ApiRequestOptions } from "./api-request";

async function request<T>(
    method: string,
    url: string,
    body?: unknown,
    options: ApiRequestOptions = {},
): Promise<T> {
    const headers = new Headers(options.headers);

    const init: RequestInit = {
        ...options,
        method,
        credentials: "include",
        headers,
    };

    if (body !== undefined) {
        if (body instanceof FormData) {
            init.body = body;
        } else {
            headers.set("Content-Type", "application/json");
            init.body = JSON.stringify(body);
        }
    }

    const response = await fetch(url, init);

    let payload: ApiResponse<T> | null = null;

    try {
        payload = (await response.json()) as ApiResponse<T>;
    } catch {
        throw new ApiError({
            status: response.status,
            code: "INVALID_RESPONSE",
            message: "The server returned an invalid response.",
        });
    }

    if (!response.ok || !payload.success) {
        const error =
            payload && !payload.success
                ? payload.error
                : {
                    code: "UNKNOWN_ERROR",
                    message: response.statusText,
                };

        throw new ApiError({
            status: response.status,
            code: error.code,
            message: error.message,
            details: error.details,
        });
    }

    return (payload as ApiSuccessResponse<T>).data;
}

export const apiClient = {
    get<T>(url: string, options?: ApiRequestOptions) {
        return request<T>("GET", url, undefined, options);
    },

    post<T>(
        url: string,
        body?: unknown,
        options?: ApiRequestOptions,
    ) {
        return request<T>("POST", url, body, options);
    },

    put<T>(
        url: string,
        body?: unknown,
        options?: ApiRequestOptions,
    ) {
        return request<T>("PUT", url, body, options);
    },

    patch<T>(
        url: string,
        body?: unknown,
        options?: ApiRequestOptions,
    ) {
        return request<T>("PATCH", url, body, options);
    },

    delete<T>(
        url: string,
        options?: ApiRequestOptions,
    ) {
        return request<T>("DELETE", url, undefined, options);
    },
};
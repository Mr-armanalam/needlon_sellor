import { ApiError } from "./api-error";
import { ApiRequestOptions } from "./api-request";
import { apiFetch } from "@/modules/auth/lib/auth-client";
import { notifyAuthStateChanged } from "@/modules/auth/lib/auth-events";

type JsonObject = Record<string, unknown>;

function isJsonObject(value: unknown): value is JsonObject {
    return typeof value === "object" && value !== null;
}

export function apiErrorFromPayload(
    payload: unknown,
    status: number,
    statusText: string,
): ApiError {
    const rawError = isJsonObject(payload) ? payload.error : undefined;
    const message =
        typeof rawError === "string"
            ? rawError
            : isJsonObject(rawError) && typeof rawError.message === "string"
                ? rawError.message
                : isJsonObject(payload) && typeof payload.message === "string"
                    ? payload.message
                    : statusText || "The request failed. Please try again.";
    const code =
        isJsonObject(rawError) && typeof rawError.code === "string"
            ? rawError.code
            : "UNKNOWN_ERROR";

    return new ApiError({
        status,
        code,
        message,
        details:
            isJsonObject(rawError) && "details" in rawError
                ? rawError.details
                : undefined,
    });
}

function authRouteForUrl(url: string): string {
    try {
        return new URL(url, "http://localhost").pathname;
    } catch {
        return url;
    }
}

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

    const response = await apiFetch(url, init);

    let payload: unknown;

    try {
        payload = await response.json();
    } catch {
        throw new ApiError({
            status: response.status,
            code: "INVALID_RESPONSE",
            message: "The server returned an invalid response.",
        });
    }

    if (
        !response.ok ||
        !isJsonObject(payload) ||
        payload.success !== true
    ) {
        throw apiErrorFromPayload(payload, response.status, response.statusText);
    }

    const pathname = authRouteForUrl(url);
    if (pathname === "/api/auth/login") {
        notifyAuthStateChanged("login");
    } else if (pathname === "/api/auth/logout") {
        notifyAuthStateChanged("logout");
    }

    return payload.data as T;
}

export const apiClient = {
    get<T>(url: string, options?: ApiRequestOptions) {
        return request<T>("GET", url, undefined, options);
    },

    post<TResponse, TRequest = unknown>(
        url: string,
        body?: TRequest,
        options?: ApiRequestOptions,
    ) {
        return request<TResponse>(
            "POST",
            url,
            body,
            options,
        );
    },

    put<TResponse, TRequest = unknown>(
        url: string,
        body?: TRequest,
        options?: ApiRequestOptions,
    ) {
        return request<TResponse>("PUT", url, body, options);
    },

    patch<TResponse, TRequest = unknown>(
        url: string,
        body?: TRequest,
        options?: ApiRequestOptions,
    ) {
        return request<TResponse>("PATCH", url, body, options);
    },

    delete<TResponse>(
        url: string,
        options?: ApiRequestOptions,
    ) {
        return request<TResponse>("DELETE", url, undefined, options);
    },
};
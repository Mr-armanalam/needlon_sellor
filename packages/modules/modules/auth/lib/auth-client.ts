import { emitAuthFailure } from "./auth-events";

let refreshPromise: Promise<{ success: boolean; status?: number }> | null = null;

async function performRefresh(): Promise<{ success: boolean; status?: number }> {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    return {
      success: response.ok,
      status: response.status,
    };
  } catch {
    return {
      success: false,
      status: 0,
    };
  }
}

export async function refreshSession(): Promise<{ success: boolean; status?: number }> {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export async function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const requestUrl =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;
  const requestUrlObject = new URL(
    requestUrl,
    typeof window === "undefined" ? "http://localhost" : window.location.origin,
  );
  const pathname = requestUrlObject.pathname;
  const shouldRefresh =
    typeof window !== "undefined" &&
    requestUrlObject.origin === window.location.origin &&
    pathname.startsWith("/api/") &&
    ![
      "/api/auth/login",
      "/api/auth/signup",
      "/api/auth/forgot-password",
      "/api/auth/send-otp",
      "/api/auth/verify-otp",
      "/api/auth/reset-password",
      "/api/auth/refresh",
    ].includes(pathname);
  const retryInput =
    typeof Request !== "undefined" && input instanceof Request
      ? input.clone()
      : input;

  const response = await fetch(input, {
    credentials: "include",
    ...init,
  });

  if (response.status !== 401 || !shouldRefresh) {
    return response;
  }

  const refreshResult = await refreshSession();

  if (!refreshResult.success) {
    // Only emit auth failure (which triggers logout) on explicit 401/403 errors.
    // Avoid logging out on temporary network (0) or server (500) compilation errors.
    if (refreshResult.status === 401 || refreshResult.status === 403) {
      emitAuthFailure();
    }

    return response;
  }

  const retryResponse = await fetch(retryInput, {
    credentials: "include",
    ...init,
  });

  if (retryResponse.status === 401) {
    emitAuthFailure();
  }

  return retryResponse;
}

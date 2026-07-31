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
  const response = await fetch(input, {
    credentials: "include",
    ...init,
  });

  if (response.status !== 401) {
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

  return fetch(input, {
    credentials: "include",
    ...init,
  });
}


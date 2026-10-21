/**
 * Tiny client-side fetch helper for the /api/admin/* routes: unwraps the
 * platform's { success, data } envelope and surfaces server error messages.
 */

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: { code?: string; message?: string };
}

export async function adminApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const json = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !json.success) {
    throw new Error(
      json.error?.message ?? `Request failed (${response.status})`,
    );
  }

  return json.data as T;
}

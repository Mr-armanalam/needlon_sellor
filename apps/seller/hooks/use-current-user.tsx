import useSWR from "swr";
import { apiFetch } from "@/modules/auth/lib/auth-client";
import { AuthSeller } from "@/types/auth";

const fetcher = (url: string) => apiFetch(url).then((res) => res.json());

export function useCurrentUser() {
  const { data, error, mutate, isLoading } = useSWR<{ user: AuthSeller }>(
    "/api/auth/me",
    fetcher,
    {
      revalidateOnFocus: true, // Automatically updates state when user switches back to your tab
      shouldRetryOnError: false,
      dedupingInterval: 5000, // Prevents multiple components calling the API at the exact same second
    },
  );

  return {
    user: data?.user ?? null,
    loading: isLoading,
    isError: !!error,
    mutate, // Call mutate() to force update state (e.g., after updating user settings)
  };
}

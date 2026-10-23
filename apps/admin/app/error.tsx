"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("ADMIN_APP_ERROR", error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-ivory p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-[0_24px_60px_-24px_rgba(38,32,24,0.35)]">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-brass-300 to-brass-600 font-garamond text-xl text-ink-950 shadow-md">
          N
        </div>
        <h1 className="mt-4 font-garamond text-2xl text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The admin console hit an unexpected error. Try again, and if it
          persists, check the server logs
          {error.digest ? ` (digest: ${error.digest})` : ""}.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-ink-800"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

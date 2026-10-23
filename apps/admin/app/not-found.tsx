import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-ivory p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-[0_24px_60px_-24px_rgba(38,32,24,0.35)]">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-brass-300 to-brass-600 font-garamond text-xl text-ink-950 shadow-md">
          N
        </div>
        <h1 className="mt-4 font-garamond text-2xl text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This admin console page does not exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-ink-800"
        >
          Back to overview
        </Link>
      </div>
    </div>
  );
}

import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";

import AdminNav from "./admin-nav";
import LogoutButton from "./logout-button";
import ThemeToggle from "./theme-toggle";

type Props = {
  children: ReactNode;
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "A";
  }
  const first = parts[0]?.charAt(0) ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? "") : "";
  return (first + last).toUpperCase();
}

export default async function AdminLayout({ children }: Props) {
  const currentSeller = await getCurrentSeller();

  if (!currentSeller) {
    redirect("/login");
  }

  if (currentSeller.role !== "admin") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-ivory p-6">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-[0_24px_60px_-24px_rgba(38,32,24,0.35)]">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-brass-300 to-brass-600 font-garamond text-xl text-ink-950 shadow-md">
            N
          </div>
          <h1 className="mt-4 font-garamond text-2xl text-foreground">
            Admin access required
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This console is restricted to platform administrators. Your
            account ({currentSeller.email}) has the{" "}
            <span className="font-medium text-foreground">
              {currentSeller.role}
            </span>{" "}
            role.
          </p>
          <LogoutButton
            label="Sign out and use another account"
            className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-ink-800"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-ivory font-sans tracking-tight select-none">
      <aside className="relative flex w-[268px] flex-shrink-0 flex-col bg-gradient-to-b from-ink-900 via-ink-950 to-black px-5 pt-7 pb-5 text-white shadow-[24px_0_60px_-32px_rgba(20,16,10,0.55)]">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-brass-500/50 via-brass-500/10 to-transparent" />

        <div className="flex items-center gap-3 px-1">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brass-300 via-brass-500 to-brass-700 font-garamond text-[22px] leading-none text-ink-950 shadow-[0_10px_24px_-8px_rgba(201,163,92,0.7)] ring-1 ring-white/20">
            N
          </div>
          <div className="min-w-0">
            <p className="font-garamond text-[22px] leading-tight text-white">
              Needlon
            </p>
            <p className="text-[10px] font-semibold tracking-[0.28em] text-brass-400 uppercase">
              Admin Console
            </p>
          </div>
        </div>

        <div className="mt-9 flex-1">
          <AdminNav />
        </div>

        <div className="mt-6 border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 px-1">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brass-300 to-brass-600 text-xs font-bold text-ink-950 ring-1 ring-white/25">
              {initialsOf(currentSeller.name)}
            </div>
            <div className="min-w-0 text-xs">
              <p className="truncate text-[13px] font-medium text-white">
                {currentSeller.name}
              </p>
              <p className="truncate text-white/45">{currentSeller.email}</p>
            </div>
          </div>
          <ThemeToggle />
          <LogoutButton className="mt-3 w-full rounded-lg px-3 py-2 text-left text-[13px] font-medium text-white/55 transition-colors hover:bg-white/[0.04] hover:text-white" />
        </div>
      </aside>

      <div className="flex w-full flex-col overflow-y-auto bg-ivory">
        {children}
      </div>
    </div>
  );
}

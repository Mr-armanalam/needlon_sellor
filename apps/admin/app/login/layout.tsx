import { ReactNode } from "react";

export default function LoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-ink-900 via-ink-950 to-black">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass-500/60 to-transparent" />
      <div className="pointer-events-none absolute top-[-20%] left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-brass-500/10 blur-3xl" />
      <div className="relative container flex min-h-screen items-center justify-center px-4 py-10">
        {children}
      </div>
    </div>
  );
}

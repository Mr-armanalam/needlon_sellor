"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Sidebar theme toggle. The admin sidebar is deep ink in both
 * modes, so the button styling is mode-independent; only the
 * icon and label swap.
 */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-white/55 transition-colors hover:bg-white/[0.04] hover:text-white"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}

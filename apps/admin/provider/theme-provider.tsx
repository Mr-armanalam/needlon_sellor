"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * Admin theme wiring. The Atelier Noir dark tokens have existed in
 * globals.css since the theme build, but nothing ever activated
 * them — this provider adds the `.dark` class strategy. Default is
 * light (the accepted console look); dark is opt-in via the sidebar
 * toggle and persists per browser.
 */
export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

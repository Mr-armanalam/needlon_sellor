"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

import { onAuthFailure } from "@/modules/auth/lib/auth-events";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthFailure(() => {
      // List of public route prefixes that should never redirect to login automatically
      const PUBLIC_PREFIXES = ["/login", "/signup", "/forgot-password", "/verify-otp", "/reset-password"];
      const isExactPublic = pathname === "/" || pathname === "/about" || pathname === "/pricing";
      const isPublicPrefix = PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

      if (!isExactPublic && !isPublicPrefix) {
        toast.error("Your session has expired. Please sign in again.");
        router.replace("/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router, pathname]);

  return <>{children}</>;
}

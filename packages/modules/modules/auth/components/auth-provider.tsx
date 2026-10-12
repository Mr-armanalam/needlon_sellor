"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

import {
  onAuthFailure,
  onAuthStateChanged,
} from "@/modules/auth/lib/auth-events";
import { useSWRConfig } from "swr";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { mutate } = useSWRConfig();

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
    const unsubscribeAuthState = onAuthStateChanged(() => {
      void mutate("/api/auth/me");
    });

    return () => {
      unsubscribe();
      unsubscribeAuthState();
    };
  }, [mutate, router, pathname]);

  return <>{children}</>;
}

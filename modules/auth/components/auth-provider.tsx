"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { onAuthFailure } from "@/modules/auth/lib/auth-events";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthFailure(() => {
      toast.error("Your session has expired. Please sign in again.");

      router.replace("/login");
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  return <>{children}</>;
}

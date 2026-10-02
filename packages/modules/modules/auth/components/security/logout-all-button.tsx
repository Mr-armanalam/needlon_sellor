"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import { apiFetch } from "@/modules/auth/lib/auth-client";
import { useRouter } from "next/navigation";

type Props = {
  onSuccess: () => void;
};

export function LogoutAllButton({ onSuccess }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogoutAll() {
    try {
      setLoading(true);

      const response = await apiFetch("/api/auth/sessions/logout-all", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to logout devices");
      }

      toast.success("All other devices logged out");
      router.push('/');

      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to logout devices",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger >
        <Button variant="destructive">Logout All Devices</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Logout All Devices?</AlertDialogTitle>

          <AlertDialogDescription>
            All sessions except your current session will be revoked.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction disabled={loading} onClick={handleLogoutAll}>
            {loading ? "Processing..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

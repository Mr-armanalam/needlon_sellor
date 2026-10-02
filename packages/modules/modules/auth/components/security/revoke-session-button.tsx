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

type Props = {
  sessionId: string;
  onSuccess: () => void;
};

export function RevokeSessionButton({ sessionId, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleRevoke() {
    try {
      setLoading(true);

      const response = await apiFetch(`/api/auth/sessions/${sessionId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to revoke session");
      }

      toast.success("Session revoked");

      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to revoke session",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive" size="sm">
          Logout Device
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Logout Device?</AlertDialogTitle>

          <AlertDialogDescription>
            This device will be signed out immediately.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={handleRevoke} disabled={loading}>
            {loading ? "Logging out..." : "Logout Device"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

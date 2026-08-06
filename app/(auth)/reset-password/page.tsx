"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/modules/auth/components/auth-shell";
import { PasswordInput } from "@/modules/auth/components/password-input";
import { PasswordStrength } from "@/modules/auth/components/password-strength";
import { useResetPasswordMutation } from "@/modules/auth/hooks";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/modules/auth/validations/reset-password-request-schema";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const resetPasswordMutation = useResetPasswordMutation();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = form.watch("password") ?? "";

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        password: values.password,
      });

      toast.success("Password updated successfully");
      router.replace("/login");
    } catch (error: any) {
      toast.error(error?.message || "Unable to reset password");
    }
  };

  const loading = resetPasswordMutation.isPending;

  return (
    <AuthShell title="Reset Password" description="Create a new password">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <PasswordInput
          placeholder="New Password"
          {...form.register("password")}
        />

        <PasswordStrength password={password} />

        <PasswordInput
          placeholder="Confirm Password"
          {...form.register("confirmPassword")}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Reset Password" description="Create a new password">
      <Suspense fallback={
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
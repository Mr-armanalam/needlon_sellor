"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { AuthShell } from "@/modules/auth/components/auth-shell";

import { authApi } from "@/modules/auth/api/auth";

import {
  forgotPasswordSchema,
  type ForgotPasswordForm,
} from "@/modules/auth/validations/forgot-password";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (
    values: ForgotPasswordForm
  ) => {
    try {
      setLoading(true);

      await authApi.forgotPassword(values);

      toast.success(
        "If an account exists, a reset code has been sent."
      );

      router.push(
        `/verify-otp?email=${encodeURIComponent(
          values.email
        )}&type=reset`
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to send reset code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Forgot Password"
      description="Enter your email to receive a password reset code"
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Enter your email"
            {...form.register("email")}
          />

          {form.formState.errors.email && (
            <p className="text-sm text-destructive">
              {
                form.formState.errors.email
                  .message
              }
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Code"
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
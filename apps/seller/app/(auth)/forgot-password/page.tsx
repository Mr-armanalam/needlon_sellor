"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { AuthShell } from "@/modules/auth/components/auth-shell";
import { useForgotPasswordMutation } from "@/modules/auth/hooks";
import {
  forgotPasswordSchema,
  type ForgotPasswordForm,
} from "@/modules/auth/validations/forgot-password";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordForm) => {
    try {
      await forgotPasswordMutation.mutateAsync(values);

      toast.success(
        "If an account exists, a reset code has been sent."
      );

      router.push(
        `/verify-otp?email=${encodeURIComponent(
          values.email
        )}&type=reset`
      );
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.message || "Unable to send reset code. Please try again."
      );
    }
  };

  const loading = forgotPasswordMutation.isPending;

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
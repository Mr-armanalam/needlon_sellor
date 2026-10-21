"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import { PasswordInput } from "@/modules/auth/components/password-input";
import { AuthShell } from "@/modules/auth/components/auth-shell";
import { useLoginMutation } from "@/modules/auth/hooks";
import {
  LoginRequestInput,
  loginRequestSchema,
} from "@/modules/auth/validations/login-request-schema";

export default function AdminLoginPage() {
  const { mutate } = useSWRConfig();
  const loginMutation = useLoginMutation();

  const form = useForm<LoginRequestInput>({
    resolver: zodResolver(loginRequestSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values: LoginRequestInput) => {
    try {
      await loginMutation.mutateAsync({
        email: values.email ?? "",
        password: values.password,
      });

      toast.success("Login successful");
      await mutate("/api/auth/me");
      window.location.assign("/");
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Login failed";
      form.setError("email", {
        type: "server",
        message: errMsg,
      });
      toast.error(errMsg);
    }
  };

  const loading = loginMutation.isPending;

  return (
    <AuthShell
      title="Admin Login"
      description="Platform administrators only"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Field data-invalid={!!form.formState.errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>

          <FieldContent>
            <Input
              id="email"
              placeholder="Enter your email"
              aria-invalid={!!form.formState.errors.email}
              {...form.register("email")}
            />

            {form.formState.errors.email?.message && (
              <FieldError>{form.formState.errors.email.message}</FieldError>
            )}
          </FieldContent>
        </Field>

        <Field data-invalid={!!form.formState.errors.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>

          <FieldContent>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              aria-invalid={!!form.formState.errors.password}
              {...form.register("password")}
            />

            {form.formState.errors.password?.message && (
              <FieldError>{form.formState.errors.password.message}</FieldError>
            )}
          </FieldContent>
        </Field>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Login"}
        </Button>
      </form>

      <p className="text-sm text-gray-500">
        This console is restricted to Needlon platform administrators.
        Seller accounts sign in through the seller app.
      </p>
    </AuthShell>
  );
}

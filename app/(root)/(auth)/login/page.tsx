"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
import { authApi } from "@/modules/auth/api/auth";
import { LoginFormValues, loginSchema } from "@/modules/auth/validations/login";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);

      const response = await authApi.login(values);

      const data = await response.json();

      if (!response.ok) {
        form.setError("email", {
          type: "server",
          message: data.message || "Something went wrong on our end",
        });
        toast.error(data.message || "Something went wrong");
        throw new Error(data.message || "Something went wrong");
      }

      toast.success("Login successful");

      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Login" description="Welcome back">
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

      <div className="flex justify-between text-sm">
        <Link href="/forgot-password">Forgot Password?</Link>

        <Link href="/signup">Sign Up</Link>
      </div>
    </AuthShell>
  );
}

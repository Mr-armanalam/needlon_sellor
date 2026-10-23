"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck } from "lucide-react";
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
    <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl shadow-[0_40px_90px_-32px_rgba(20,16,10,0.55)] ring-1 ring-black/10 lg:grid-cols-[1fr_1.15fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-ink-900 via-ink-950 to-black p-9 text-white lg:flex">
        <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-brass-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 size-72 rounded-full bg-brass-600/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-brass-300 via-brass-500 to-brass-700 font-garamond text-[22px] leading-none text-ink-950 shadow-[0_10px_24px_-8px_rgba(201,163,92,0.7)] ring-1 ring-white/20">
            N
          </div>
          <div>
            <p className="font-garamond text-[22px] leading-tight">Needlon</p>
            <p className="text-[10px] font-semibold tracking-[0.28em] text-brass-400 uppercase">
              Admin Console
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="h-px w-14 bg-gradient-to-r from-brass-400 to-transparent" />
          <p className="mt-5 font-garamond text-[28px] leading-snug text-white/95">
            The platform,
            <br />
            tailored to perfection.
          </p>
          <p className="mt-3 max-w-[26ch] text-sm leading-relaxed text-white/50">
            Sellers, delivery, support and platform settings — every control
            in one place.
          </p>
        </div>

        <p className="relative flex items-center gap-2 text-xs text-white/40">
          <ShieldCheck className="size-4 text-brass-400" strokeWidth={1.75} />
          Restricted to platform administrators
        </p>
      </div>

      <div className="bg-card p-8 sm:p-10">
        <div className="flex items-center gap-3 lg:hidden">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brass-300 via-brass-500 to-brass-700 font-garamond text-xl leading-none text-ink-950 ring-1 ring-black/10">
            N
          </div>
          <div>
            <p className="font-garamond text-xl leading-tight text-foreground">
              Needlon
            </p>
            <p className="text-[9px] font-semibold tracking-[0.28em] text-brass-600 uppercase">
              Admin Console
            </p>
          </div>
        </div>

        <h1 className="mt-2 font-garamond text-[32px] leading-tight text-foreground lg:mt-0">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in with your administrator account.
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-7 space-y-4"
        >
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
                <FieldError>
                  {form.formState.errors.password.message}
                </FieldError>
              )}
            </FieldContent>
          </Field>

          <Button
            type="submit"
            disabled={loading}
            className="w-full shadow-[0_14px_28px_-12px_rgba(38,32,24,0.55)]"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Sign in to the console"
            )}
          </Button>
        </form>

        <p className="mt-6 border-t border-border pt-4 text-[13px] leading-relaxed text-muted-foreground">
          This console is restricted to Needlon platform administrators.
          Seller accounts sign in through the seller app.
        </p>
      </div>
    </div>
  );
}

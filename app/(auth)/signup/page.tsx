"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { AuthShell } from "@/modules/auth/components/auth-shell";
import { PasswordInput } from "@/modules/auth/components/password-input";
import { PasswordStrength } from "@/modules/auth/components/password-strength";

import { authApi } from "@/modules/auth/api/auth";
import {
  SignupFormValues,
  signupSchema,
} from "@/modules/auth/validations/signup-schema";
import { useForm, useWatch } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldError } from "@/components/ui/field";

export default function SignupPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const {
    setError,
    register,
    setValue,
    watch,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "seller",
    },
  });

  const password = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  // Track state for the select element
  const currentRole = watch("role");

  const onSubmit = async (values: SignupFormValues) => {
    try {
      setLoading(true);

      const response = await authApi.signup({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: values.role,
      });

      const data = await response.json();

      if (!response.ok) {
        setError("email", {
          type: "server",
          message: "something went wrong",
        });
        console.log(data);

        toast.error(JSON.stringify(data.errors));
        throw new Error(JSON.stringify(data.error));
      }

      toast.success("Verification code sent to your email");

      router.push(
        `/verify-otp?email=${encodeURIComponent(values.email)}&type=signup`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create account",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create Account"
      description="Create your account to get started"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Full Name"
            autoComplete="name"
            {...register("name")}
          />

          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email Address"
            autoComplete="email"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <PasswordInput
            placeholder="Password"
            autoComplete="new-password"
            {...register("password")}
          />

          <PasswordStrength password={password} />

          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <PasswordInput
            placeholder="Confirm Password"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />

          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Field>
            <Select
              value={currentRole}
              defaultValue="seller"
              onValueChange={(value) => setValue("role", (value ?? "seller") as "seller" | "admin", { shouldValidate: true })}
            >
              <SelectTrigger id="role" className={'w-full'}>
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seller">Seller Account</SelectItem>
                <SelectItem value="admin">Admin Account</SelectItem>
              </SelectContent>
            </Select>
            <FieldError>{errors.role?.message}</FieldError>
          </Field>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

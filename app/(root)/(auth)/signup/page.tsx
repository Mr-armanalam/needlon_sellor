"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { AuthShell } from "@/modules/auth/components/auth-shell";
import { PasswordInput } from "@/modules/auth/components/password-input";
import { PasswordStrength } from "@/modules/auth/components/password-strength";

export default function SignupPage() {
  const [password, setPassword] =
    useState("");

  return (
    <AuthShell
      title="Create Account"
      description="Join the platform"
    >
      <form className="space-y-4">
        <Input placeholder="Full Name" />

        <Input placeholder="Email" />

        <PasswordInput
          placeholder="Password"
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <PasswordStrength
          password={password}
        />

        <PasswordInput placeholder="Confirm Password" />

        <Button className="w-full">
          Create Account
        </Button>
      </form>
    </AuthShell>
  );
}
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AuthShell } from "@/modules/auth/components/auth-shell";
import { PasswordInput } from "@/modules/auth/components/password-input";
import { PasswordStrength } from "@/modules/auth/components/password-strength";

export default function ResetPasswordPage() {
  const [password, setPassword] =
    useState("");

  return (
    <AuthShell
      title="Reset Password"
      description="Create a new password"
    >
      <div className="space-y-4">
        <PasswordInput
          placeholder="New Password"
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
          Update Password
        </Button>
      </div>
    </AuthShell>
  );
}
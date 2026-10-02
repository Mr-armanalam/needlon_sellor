"use client";

import { usePasswordStrength } from "../hooks/use-password-strength";


export function PasswordStrength({
  password,
}: {
  password: string;
}) {
  const { score, label } =
    usePasswordStrength(password);

  return (
    <div className="space-y-2">
      <div className="h-2 rounded bg-muted">
        <div
          className="h-full rounded bg-primary transition-all"
          style={{
            width: `${score * 20}%`,
          }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Strength: {label}
      </p>
    </div>
  );
}
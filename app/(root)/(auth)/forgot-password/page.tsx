
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { AuthShell } from "@/modules/auth/components/auth-shell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot Password"
      description="Receive a reset code"
    >
      <form className="space-y-4">
        <Input placeholder="Email" />

        <Button className="w-full">
          Send Code
        </Button>
      </form>
    </AuthShell>
  );
}
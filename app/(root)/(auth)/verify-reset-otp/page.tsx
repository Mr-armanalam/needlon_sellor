

import { Button } from "@/components/ui/button";
import { AuthShell } from "@/modules/auth/components/auth-shell";
import { OtpInput } from "@/modules/auth/components/otp-input";

export default function VerifyResetOtpPage() {
  return (
    <AuthShell
      title="Verify Reset Code"
      description="Enter the code sent to your email"
    >
      <div className="space-y-4">
        <OtpInput />

        <Button className="w-full">
          Continue
        </Button>
      </div>
    </AuthShell>
  );
}
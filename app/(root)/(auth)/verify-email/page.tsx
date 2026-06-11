
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/modules/auth/components/auth-shell";
import { OtpInput } from "@/modules/auth/components/otp-input";
import { ResendOtp } from "@/modules/auth/components/resend-otp";


export default function VerifyEmailPage() {
  return (
    <AuthShell
      title="Verify Email"
      description="Enter the code sent to your email"
    >
      <div className="space-y-6">
        <OtpInput />

        <Button className="w-full">
          Verify Email
        </Button>

        <div className="text-center">
          <ResendOtp />
        </div>
      </div>
    </AuthShell>
  );
}
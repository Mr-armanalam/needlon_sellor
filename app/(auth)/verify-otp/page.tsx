"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/modules/auth/components/auth-shell";
import { OtpInput } from "@/modules/auth/components/otp-input";
import { ResendOtp } from "@/modules/auth/components/resend-otp";
import { useVerifyEmailMutation, useVerifyResetOtpMutation } from "@/modules/auth/hooks";

function VerifyOtpView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? "";
  const type = searchParams.get("type") ?? "signup";

  const [otp, setOtp] = useState(Array(6).fill(""));

  const verifyEmailMutation = useVerifyEmailMutation();
  const verifyResetOtpMutation = useVerifyResetOtpMutation();

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter a valid OTP");
      return;
    }

    try {
      if (type === "signup") {
        await verifyEmailMutation.mutateAsync({
          email,
          code,
          type,
        });

        toast.success("Email verified successfully");
        router.push("/login");
      } else {
        const data = await verifyResetOtpMutation.mutateAsync({
          email,
          code,
          type: "reset",
        });

        toast.success("OTP verified successfully");
        router.replace(`/reset-password?token=${data?.resetToken || data}`);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Invalid or expired OTP");
    }
  };

  const loading = verifyEmailMutation.isPending || verifyResetOtpMutation.isPending;

  return (
    <AuthShell
      title={type === "signup" ? "Verify Email" : "Verify Reset Code"}
      description={`We've sent a 6-digit code to ${email}`}
    >
      <div className="space-y-6">
        <OtpInput otp={otp} setOtp={setOtp} />

        <Button
          className="w-full"
          onClick={handleVerify}
          disabled={loading || otp.join("").length !== 6}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </Button>

        <div className="text-center">
          <ResendOtp email={email} type={type} />
        </div>
      </div>
    </AuthShell>
  );
}

export default function VerifyOtpPage() {
  return (
    <div>
      <Suspense fallback={
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }>
        <VerifyOtpView />
      </Suspense>
    </div>
  );
}
"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Loader2 } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { authApi } from "@/modules/auth/api/auth";

import { AuthShell } from "@/modules/auth/components/auth-shell";
import { OtpInput } from "@/modules/auth/components/otp-input";
import { ResendOtp } from "@/modules/auth/components/resend-otp";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? "";

  const type = searchParams.get("type") ?? "signup";

  const [otp, setOtp] = useState(Array(6).fill(""));

  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid OTP");
      return;
    }

    try {
      setLoading(true);

      const response =
        type === "signup"
          ? await authApi.verifyEmail({
              email,
              code: otp.join(""),
              type,
            })
          : await authApi.verifyResetOtp({
              email,
              code: otp.join(""),
              type: "reset",
            });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error);
        throw new Error(data.error);
      }

      if (type === "signup") {
        toast.success("Email verified successfully");

        router.push("/login");
        return;
      }

      toast.success("OTP verified successfully");

      router.replace(`/reset-password?token=${data.resetToken}`);
    } catch (error) {
      console.error(error);

      toast.error("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

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
          disabled={loading || otp.length !== 6}
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

"use client";

import { Button } from "@/components/ui/button";
import { useCountdown, useSendOtpMutation } from "../hooks";
import { toast } from "sonner";
import { useState } from "react";

type ResendOtpInputProps = {
  email: string;
  type: string;
};

export function ResendOtp({ email, type }: ResendOtpInputProps) {
  const [error, setError] = useState("");
  const { completed, seconds, restart } = useCountdown(30);
  const sendOtpMutation = useSendOtpMutation();

  const handleResend = async () => {
    try {
      setError("");
      const data = await sendOtpMutation.mutateAsync({
        email,
        type,
      });

      restart();
      toast.success(data?.message || "OTP sent successfully");
    } catch (err: any) {
      setError(err?.message || "Failed to resend OTP");
      toast.error(err?.message || "Failed to resend OTP");
    }
  };

  return (
    <div>
      <Button
        variant="link"
        className={`cursor-pointer`}
        disabled={!completed || sendOtpMutation.isPending}
        onClick={handleResend}
      >
        {completed ? "Resend OTP" : `Resend in ${seconds}s`}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

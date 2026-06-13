"use client";

import { Button } from "@/components/ui/button";
import { useCountdown } from "../hooks/use-countdown";
import { authApi } from "../api/auth";
import { toast } from "sonner";
import { useState } from "react";

type ResendOtpInputProps = {
  email: string;
  type: string;
};

export function ResendOtp({ email, type }: ResendOtpInputProps) {
  const [error, setError] = useState("");
  const { completed, seconds, restart } = useCountdown(30);

  const handleResend = async () => {
    const response = await authApi.resendOtp({
      email,
      type,
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      throw new Error(data.error);
    }

    restart();

    toast.success(data.message);
  };

  return (
    <div>
      <Button variant="link" className={`cursor-pointer`} disabled={!completed} onClick={handleResend}>
        {completed ? "Resend OTP" : `Resend in ${seconds}s`}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

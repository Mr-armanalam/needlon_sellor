"use client";

import { Button } from "@/components/ui/button";
import { useCountdown } from "../hooks/use-countdown";

export function ResendOtp() {
  const {
    completed,
    seconds,
    restart,
  } = useCountdown(30);

  const handleResend = async () => {
    restart();
  };

  return (
    <Button
      variant="link"
      disabled={!completed}
      onClick={handleResend}
    >
      {completed
        ? "Resend OTP"
        : `Resend in ${seconds}s`}
    </Button>
  );
}
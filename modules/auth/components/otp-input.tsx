"use client";

import {
  useRef,
  useState,
} from "react";

type OtpInputProps = {
  otp: string[];
  setOtp: (value: string[]) => void;
};
export function OtpInput({otp, setOtp}: OtpInputProps) {

  const refs = useRef<
    HTMLInputElement[]
  >([]);

  const handleChange = (
    value: string,
    index: number
  ) => {
    if (!/^\d?$/.test(value))
      return;

    const next = [...otp];

    next[index] = value;

    setOtp(next);

    if (value && index < 5)
      refs.current[
        index + 1
      ]?.focus();
  };

  return (
    <div className="flex justify-center gap-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          value={digit}
          maxLength={1}
          ref={(el) => {
            if (el)
              refs.current[index] =
                el;
          }}
          onChange={(e) =>
            handleChange(
              e.target.value,
              index
            )
          }
          className="h-12 w-12 rounded-md border text-center text-lg"
        />
      ))}
    </div>
  );
}
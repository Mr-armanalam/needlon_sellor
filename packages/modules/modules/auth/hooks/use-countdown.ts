"use client";

import { useEffect, useState } from "react";

export function useCountdown(
  initial: number
) {
  const [seconds, setSeconds] =
    useState(initial);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const restart = () =>
    setSeconds(initial);

  return {
    seconds,
    restart,
    completed: seconds === 0,
  };
}
import { NextRequest } from "next/server";

export function getClientIp(
  request: NextRequest
) {
  const forwarded =
    request.headers.get("x-forwarded-for");

  return (
    forwarded?.split(",")[0]?.trim() ??
    "unknown"
  );
}
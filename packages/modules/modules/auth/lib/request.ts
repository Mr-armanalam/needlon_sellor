import { NextRequest } from "next/server";

export function getClientIp(
  request: NextRequest
) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfIp = request.headers.get("cf-connecting-ip");

  const clientIp =
    cfIp ||
    realIp ||
    forwarded?.split(",")[0]?.trim();

  return clientIp || "127.0.0.1";
}
import { headers } from "next/headers";

export async function getApiBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL;
  }
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "http";
    if (host) {
      return `${protocol}://${host}`;
    }
  } catch {
    // Ignore headers call outside request context
  }
  return "http://localhost:3000";
}

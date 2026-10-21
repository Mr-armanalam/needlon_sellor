import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { EXECUTIVE_SESSION_COOKIE } from "@/modules/delivery/lib/executive-session";

export async function POST() {
  return routeHandler(async () => {
    const response = successResponse({ loggedOut: true });
    response.cookies.set(EXECUTIVE_SESSION_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  });
}

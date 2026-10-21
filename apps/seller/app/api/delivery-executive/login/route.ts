import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import { loginExecutiveService } from "@/modules/delivery/services/executive.service";
import { executiveLoginSchema } from "@/modules/delivery/dto/executive.dto";
import {
  EXECUTIVE_SESSION_COOKIE,
  EXECUTIVE_SESSION_TTL_SECONDS,
} from "@/modules/delivery/lib/executive-session";

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await parseBody(req, executiveLoginSchema);
    const { executive, token } = await loginExecutiveService(
      body.phone,
      body.password,
    );

    const response = successResponse({ executive });
    response.cookies.set(EXECUTIVE_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: EXECUTIVE_SESSION_TTL_SECONDS,
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  });
}

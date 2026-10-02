import { cookies } from "next/headers";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { blocklistToken, getAccessTokenPayload } from "@/modules/auth/lib/tokens";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { revokeSessionsExcept, revokeSessionById } from "@/modules/logout/repository";
import { UnauthorizedError } from "@/modules/shared/errors";

export async function POST() {
  return routeHandler(async () => {
    const seller = await getCurrentSeller();

    if (!seller) {
      throw new UnauthorizedError();
    }

    const cookieStore = await cookies();
    const currentSessionId = cookieStore.get("session_id")?.value;

    // Revoke all other sessions
    await revokeSessionsExcept(seller.id, currentSessionId);

    // Blocklist current access token if it exists
    const accessToken = cookieStore.get("access_token")?.value;
    if (accessToken) {
      const payload = await getAccessTokenPayload(accessToken);
      if (payload?.jti && payload.exp) {
        const ttl = Math.max(payload.exp - Math.floor(Date.now() / 1000), 1);
        await blocklistToken(payload.jti, ttl);
      }
    }

    // Revoke current session
    if (currentSessionId) {
      await revokeSessionById(currentSessionId, seller.id);
    }

    // Clear authentication cookies
    cookieStore.set("access_token", "", {
      expires: new Date(0),
      path: "/",
    });

    cookieStore.set("refresh_token", "", {
      expires: new Date(0),
      path: "/",
    });

    cookieStore.set("session_id", "", {
      expires: new Date(0),
      path: "/",
    });

    return successResponse({ success: true });
  });
}

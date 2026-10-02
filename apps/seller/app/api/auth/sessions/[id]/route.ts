import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { cookies } from "next/headers";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";
import { revokeSessionById } from "@/modules/logout/repository";
import { UnauthorizedError, BadRequestError, NotFoundError } from "@/modules/shared/errors";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(req: Request, { params }: Params) {
  return routeHandler(async () => {
    const seller = await getCurrentSeller();

    if (!seller) {
      throw new UnauthorizedError();
    }

    const { id } = await params;
    const cookieStore = await cookies();
    const currentSessionId = cookieStore.get("session_id")?.value;

    if (id === currentSessionId) {
      throw new BadRequestError("Use logout instead");
    }

    const result = await revokeSessionById(id, seller.id);

    if (result.length === 0) {
      throw new NotFoundError("Session not found");
    }

    return successResponse({ success: true });
  });
}

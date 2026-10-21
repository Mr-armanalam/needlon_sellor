import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { parseBody } from "@/modules/shared/api/parse-body";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  requireExecutiveSession,
  updateExecutiveAssignmentStatusService,
} from "@/modules/delivery/services/executive.service";
import { executiveAssignmentStatusSchema } from "@/modules/delivery/dto/executive.dto";
import { EXECUTIVE_SESSION_COOKIE } from "@/modules/delivery/lib/executive-session";

interface RouteContext {
  params: Promise<{
    assignmentId: string;
  }>;
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  return routeHandler(async () => {
    const executive = await requireExecutiveSession(
      req.cookies.get(EXECUTIVE_SESSION_COOKIE)?.value,
    );
    const { assignmentId } = await params;
    const body = await parseBody(req, executiveAssignmentStatusSchema);

    const assignment = await updateExecutiveAssignmentStatusService(
      executive.id,
      assignmentId,
      body,
    );

    return successResponse({ assignment });
  });
}

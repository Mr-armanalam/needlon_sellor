import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { NotificationService } from "@/modules/notification/services/notification-service";

export const GET = async () => {
  try {
    const session = await auth();
    const userId = session?.user?.id ?? "mock-user";

    const notifications = await NotificationService.getBuyerNotifications(userId);
    return NextResponse.json({ notification: notifications }, { status: 200 });
  } catch (error) {
    console.error("NOTIFICATION_GET_ERROR:", error);
    return NextResponse.json({ notification: [] }, { status: 200 });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const session = await auth();
    const userId = session?.user?.id ?? "mock-user";
    const body = await req.json().catch(() => ({}));
    const { notification_id } = body;

    if (!notification_id) {
      return NextResponse.json({ error: "notification_id is required" }, { status: 400 });
    }

    const result = await NotificationService.markNotificationAsRead(notification_id, userId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("NOTIFICATION_PATCH_ERROR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};

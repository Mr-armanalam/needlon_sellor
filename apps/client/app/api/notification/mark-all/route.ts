import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { NotificationService } from "@/modules/notification/services/notification-service";

export const PATCH = async () => {
  try {
    const session = await auth();
    const userId = session?.user?.id ?? "mock-user";

    const result = await NotificationService.markAllNotificationsAsRead(userId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("NOTIFICATION_MARK_ALL_ERROR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};

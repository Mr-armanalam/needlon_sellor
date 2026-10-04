import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notifications } from "@/db/schema/notifications/notification-events";
import { getCurrentSeller } from "@/modules/auth/lib/get-current-seller";

export async function POST(req: NextRequest) {
  try {
    const currentSeller = await getCurrentSeller();

    if (!currentSeller) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const title = body?.title || "Test Notification: Pipeline Verified";
    const message =
      body?.message ||
      "Your notification channels and real-time navbar alerts are synchronized and working properly.";
    const type = body?.type || "SYSTEM";

    const [created] = await db
      .insert(notifications)
      .values({
        recipientType: "SELLER",
        recipientId: currentSeller.id,
        notificationType: type,
        title,
        message,
        priority: "HIGH",
        isRead: false,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: created,
      message: "Test notification sent successfully",
    });
  } catch (error) {
    console.error("TEST_NOTIFICATION_ERROR", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

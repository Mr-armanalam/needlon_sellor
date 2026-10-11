import { NextRequest, NextResponse } from "next/server";
import { getSellerProfile } from "@/modules/seller-profile/services";
import { recordInStoreHandoverRepo } from "@/modules/customers/repository/customer.repository";
import { recordHandoverSchema } from "@/modules/customers/dto/fitting-appointment.dto";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const profile = await getSellerProfile();
    const { orderId } = await context.params;
    const body = await request.json().catch(() => ({}));
    const parsed = recordHandoverSchema.safeParse(body);

    const updated = await recordInStoreHandoverRepo(
      profile.sellerId,
      orderId,
      parsed.success ? parsed.data : undefined
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("POST_HANDOVER_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to record in-store handover" },
      { status: 500 }
    );
  }
}

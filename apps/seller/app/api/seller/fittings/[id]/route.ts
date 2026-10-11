import { NextRequest, NextResponse } from "next/server";
import { getSellerProfile } from "@/modules/seller-profile/services";
import { updateFittingAppointmentRepo } from "@/modules/customers/repository/customer.repository";
import { updateFittingAppointmentSchema } from "@/modules/customers/dto/fitting-appointment.dto";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await getSellerProfile();
    const { id: appointmentId } = await context.params;
    const body = await request.json();
    const parsed = updateFittingAppointmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const updated = await updateFittingAppointmentRepo(profile.sellerId, appointmentId, parsed.data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PATCH_FITTINGS_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update fitting session" },
      { status: 500 }
    );
  }
}

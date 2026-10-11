import { NextRequest, NextResponse } from "next/server";
import { getSellerProfile } from "@/modules/seller-profile/services";
import {
  scheduleFittingAppointmentRepo,
  getFittingAppointmentsRepo,
} from "@/modules/customers/repository/customer.repository";
import { scheduleFittingAppointmentSchema } from "@/modules/customers/dto/fitting-appointment.dto";

export async function GET(request: NextRequest) {
  try {
    const profile = await getSellerProfile();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId") || undefined;
    const customerId = searchParams.get("customerId") || undefined;

    const list = await getFittingAppointmentsRepo(profile.sellerId, orderId, customerId);
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    console.error("GET_FITTINGS_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load fitting appointments" },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const profile = await getSellerProfile();
    const body = await request.json();
    const parsed = scheduleFittingAppointmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const appointment = await scheduleFittingAppointmentRepo(profile.sellerId, parsed.data);
    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch (error: any) {
    console.error("POST_FITTINGS_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to schedule fitting session" },
      { status: 500 }
    );
  }
}

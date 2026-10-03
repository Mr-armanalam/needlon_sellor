import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import {
  getSellerCouponsService,
  createCouponService,
  deleteCouponService,
} from "@/modules/marketing/services/marketing.service";
import { createCouponSchema } from "@/modules/marketing/dto/marketing.dto";

export async function GET() {
  return routeHandler(async () => {
    const coupons = await getSellerCouponsService();
    return successResponse(coupons);
  });
}

export async function POST(req: NextRequest) {
  return routeHandler(async () => {
    const body = await req.json();
    const validated = createCouponSchema.parse(body);
    const newCoupon = await createCouponService(validated);
    return successResponse(newCoupon, "Coupon created successfully");
  });
}

export async function DELETE(req: NextRequest) {
  return routeHandler(async () => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) throw new Error("Coupon ID is required");

    await deleteCouponService(id);
    return successResponse(null, "Coupon deleted successfully");
  });
}

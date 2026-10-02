import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getSellerCustomerDetailsService } from "@/modules/customers/services/customer.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ buyerId: string }> }
) {
  return routeHandler(async () => {
    const { buyerId } = await params;
    const details = await getSellerCustomerDetailsService(buyerId);
    return successResponse(details);
  });
}

import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getSellerCustomersService } from "@/modules/customers/services/customer.service";
import { getCustomersQuerySchema } from "@/modules/customers/dto/customer.dto";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const { searchParams } = new URL(req.url);
    const queryObj = Object.fromEntries(searchParams.entries());
    const validatedQuery = getCustomersQuerySchema.parse(queryObj);

    const customers = await getSellerCustomersService(validatedQuery.search);
    return successResponse({
      customers,
      totalCount: customers.length,
    });
  });
}

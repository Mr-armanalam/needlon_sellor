import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { getFilteredOrdersService } from "@/modules/orders/services";
import { successResponse } from "@/modules/shared/api/success-response";
import { getFilteredOrdersQuerySchema } from "@/modules/orders/validations";
import { toOrderListItemDto } from "@/modules/orders/mapper";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const { searchParams } = new URL(req.url);
    
    // Convert searchParams to a simple object
    const queryObj = Object.fromEntries(searchParams.entries());
    
    // Validate request query parameters using Zod
    const validatedDto = getFilteredOrdersQuerySchema.parse(queryObj);
    
    // Call service to get domain models (internally resolves current seller)
    const { items, counts } = await getFilteredOrdersService(validatedDto);
    
    // Transform domain models to response DTOs using flat mapper function
    const transformedItems = items.map(toOrderListItemDto);
    
    return successResponse({ 
      items: transformedItems, 
      counts 
    });
  });
}

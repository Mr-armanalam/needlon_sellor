import { NextRequest } from "next/server";
import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { getFilteredOrderService } from "@/modules/orders/services/get-filtered-order.service";
import { successResponse } from "@/modules/shared/api/success-response";
import { getFilteredOrdersQuerySchema } from "@/modules/orders/validations";
import { OrderTransformer } from "@/modules/orders/transformers/order.transformer";

export async function GET(req: NextRequest) {
  return routeHandler(async () =>  {
    const seller = await getCurrentSellerOrThrow();
    const sellerId = seller.id;
    const { searchParams } = new URL(req.url);
    
    // Convert searchParams to a simple object
    const queryObj = Object.fromEntries(searchParams.entries());
    
    // Validate request query parameters using Zod
    const validatedDto = getFilteredOrdersQuerySchema.parse(queryObj);
    
    // Call service to get domain models
    const { items, counts } = await getFilteredOrderService(validatedDto, sellerId);
    
    // Transform domain models to response DTOs
    const transformedItems = items.map(OrderTransformer.toListItemDto);
    
    return successResponse({ 
      items: transformedItems, 
      counts 
    });
  });
}

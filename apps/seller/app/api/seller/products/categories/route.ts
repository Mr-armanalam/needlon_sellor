import { routeHandler } from "@/modules/shared/api/route-handler";
import {successResponse} from "@/modules/shared/api/success-response";
import {getCategoriesService} from "@/modules/products/services/get-categories.service";

export async function GET() {
  return routeHandler(async () => {

      const result = await getCategoriesService();
      return successResponse(result);

  });
}

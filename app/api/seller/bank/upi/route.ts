import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import {setUPI_IDService} from "@/modules/seller/services/set_upi_id.service";


export async function POST(
    request: Request,
) {
    return routeHandler(async () => {
        const body =
            await request.json();

        const account =
            await setUPI_IDService(
                body,
            );

        return successResponse(account);
    });
}
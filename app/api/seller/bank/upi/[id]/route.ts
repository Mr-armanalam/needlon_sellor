import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { deleteUpiIdService } from "@/modules/seller/services";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function DELETE(
    request: Request,
    { params }: RouteParams,
) {
    return routeHandler(async () => {
        const { id } = await params;

        await deleteUpiIdService( id);

        return successResponse({
            success: true,
        });
    });
}
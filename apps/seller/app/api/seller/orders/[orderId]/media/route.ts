import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { addOrderMediaService } from "@/modules/customers/services/customer.service";
import { uploadProductMediaToSupabase } from "@/modules/products/services";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  return routeHandler(async () => {
    const { orderId } = await params;
    const contentType = req.headers.get("content-type") || "";

    let mediaUrl: string | null = null;
    let caption: string | undefined = undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      caption = (formData.get("caption") as string) || undefined;

      if (!file) {
        throw new Error("No file provided for upload.");
      }

      const uploadResult = await uploadProductMediaToSupabase({
        productId: orderId,
        file,
        fileName: file.name,
        mimeType: file.type || "image/jpeg",
      });

      mediaUrl = uploadResult.publicUrl;
    } else {
      const body = await req.json();
      mediaUrl = body.mediaUrl || body.url;
      caption = body.caption;
    }

    if (!mediaUrl) {
      throw new Error("Media URL or file is required.");
    }

    const result = await addOrderMediaService(orderId, mediaUrl, caption);
    return successResponse(result, 201);
  });
}

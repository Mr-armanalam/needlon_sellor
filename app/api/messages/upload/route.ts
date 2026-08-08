import { NextRequest, NextResponse } from "next/server";
import { getSellerProfile } from "@/modules/seller-profile/services";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        await getSellerProfile();
        
        const attachmentId = crypto.randomUUID();
        const originalFileName = file.name;
        const contentType = file.type;
        const fileSize = file.size;

        const extension = originalFileName.split(".").pop()?.toLowerCase() ?? "bin";
        const fileName = `${attachmentId}.${extension}`;
        const bucketName = "chat-attachments";
        const storagePath = `chat/${fileName}`;

        try {
            const { data: buckets } = await supabaseServer.storage.listBuckets();
            const exists = buckets?.some(b => b.id === bucketName);
            if (!exists) {
                await supabaseServer.storage.createBucket(bucketName, { public: true });
            }
        } catch (bucketErr) {
            console.warn("Failed checking/creating bucket:", bucketErr);
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const { error: uploadError } = await supabaseServer.storage
            .from(bucketName)
            .upload(storagePath, buffer, {
                contentType,
                cacheControl: "3600",
                upsert: true,
            });

        if (uploadError) {
            throw uploadError;
        }

        const { data: { publicUrl } } = supabaseServer.storage
            .from(bucketName)
            .getPublicUrl(storagePath);

        return NextResponse.json({
            success: true,
            attachmentId,
            fileName: fileName,
            originalFileName,
            storagePath,
            contentType,
            fileSize,
            url: publicUrl,
        });
    } catch (err: any) {
        console.error("Upload error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { heroItems } from "@/db/schema/hero-items";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const offer = formData.get("offer") as string;
    const slug = formData.get("slug") as string;
    const file = formData.get("image") as File;

    if (!file) {
      return Response.json({ error: "Image required" }, { status: 400 });
    }

    const supabase = supabaseServer();

    // ---  Upload image to storage ---
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("hero-images")
      .upload(fileName, file, { contentType: file.type });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("hero-images").getPublicUrl(fileName);

    // ---  Insert into heroItems table ---
    const { error: insertError } = await supabase.from("heroItems").insert({
      name,
      description,
      offer,
      slug,
      image: publicUrl,
    });

    if (insertError) throw insertError;

    return Response.json({ success: true, image: publicUrl }, { status: 200 });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await db.select().from(heroItems);
    if (!data || data.length === 0) {
      const { MOCK_HERO_ITEMS } = await import("@/lib/mock-data-provider");
      return Response.json({ success: true, items: MOCK_HERO_ITEMS }, { status: 200 });
    }
    return Response.json({ success: true, items: data }, { status: 200 });
  } catch (error: any) {
    console.warn("DB call failed in hero-items GET, returning mock fallback:", error.message);
    const { MOCK_HERO_ITEMS } = await import("@/lib/mock-data-provider");
    return Response.json({ success: true, items: MOCK_HERO_ITEMS }, { status: 200 });
  }
}

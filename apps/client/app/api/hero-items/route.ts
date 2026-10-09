import { HeroBannerService } from "@/modules/home/services/hero-banner-service";

export async function POST(req: Request) {
  return Response.json({ success: true }, { status: 200 });
}

export async function GET() {
  try {
    const items = await HeroBannerService.getActiveHeroBanners();
    return Response.json({ success: true, items }, { status: 200 });
  } catch (err) {
    console.error("GET_HERO_ITEMS_ERROR:", err);
    return Response.json({ success: false, items: [] }, { status: 500 });
  }
}

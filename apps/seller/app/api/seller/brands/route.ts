import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { db } from "@/db";
import { brands } from "@/db/schema/seller/brand";
import { or, eq } from "drizzle-orm";
import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";

export async function GET() {
  return routeHandler(async () => {
    let currentSellerId: string | null = null;
    try {
      const currentSeller = await getCurrentSellerOrThrow();
      currentSellerId = currentSeller?.id || null;
    } catch {
      // Allow unauthenticated fallback for public verified brands
    }

    const conditions = [eq(brands.isVerified, true)];
    if (currentSellerId) {
      conditions.push(eq(brands.sellerId, currentSellerId));
    }

    let brandList = await db
      .select()
      .from(brands)
      .where(or(...conditions));

    if (brandList.length === 0) {
      // Seed initial verified platform brands if empty
      const defaultBrands = [
        { name: "House of Needlon", slug: "house-of-needlon", isVerified: true, description: "Official bespoke tailoring house" },
        { name: "Banaras Heritage", slug: "banaras-heritage", isVerified: true, description: "Authentic handloom silks" },
        { name: "Chanderi Weavers Guild", slug: "chanderi-weavers-guild", isVerified: true, description: "Pure handspun cotton & silk" },
        { name: "Royal Atelier", slug: "royal-atelier", isVerified: true, description: "Master tailored suits & sherwanis" },
        { name: "Kashmir Crafts", slug: "kashmir-crafts", isVerified: true, description: "Artisanal fine embroidery & pashmina" },
      ];

      brandList = await db
        .insert(brands)
        .values(defaultBrands)
        .returning();
    }

    return successResponse({ brands: brandList });
  });
}

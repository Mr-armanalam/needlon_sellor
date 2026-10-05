import { NextRequest } from "next/server";
import { routeHandler } from "@/modules/shared/api/route-handler";
import { successResponse } from "@/modules/shared/api/success-response";
import { getSellerAcademyProgressService } from "@/modules/help/services/help.service";

export async function GET(req: NextRequest) {
  return routeHandler(async () => {
    const { overallPercent } = await getSellerAcademyProgressService();

    const setupChecklist = [
      { id: 1, text: "Complete your business profile", done: true, route: "/seller-profile" },
      { id: 2, text: "Add your first marketplace product", done: true, route: "/products/new" },
      { id: 3, text: "Configure local delivery charges", done: false, route: "/delivery" },
      { id: 4, text: "Set up primary payment settlement route", done: false, route: "/settings" },
    ];

    const popularVideos = [
      { id: "vid-1", title: "Boutique Product Photography Tips", duration: "4 min", level: "Beginner", progress: "100%" },
      { id: "vid-2", title: "Mastering Customer Communication Layouts", duration: "7 min", level: "Intermediate", progress: "40%" },
    ];

    return successResponse({
      learningProgress: overallPercent,
      setupChecklist,
      popularVideos,
    });
  });
}

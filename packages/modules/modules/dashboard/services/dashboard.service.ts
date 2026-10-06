import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import { getDashboardOverviewData } from "../repository/dashboard.repository";
import { DashboardOverviewResponseDto } from "../dto/dashboard.dto";

export async function getDashboardOverviewService(): Promise<DashboardOverviewResponseDto> {
  const seller = await getCurrentSellerOrThrow();
  return getDashboardOverviewData(seller.id);
}

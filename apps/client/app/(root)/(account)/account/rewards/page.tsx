import RewardsView from "@/modules/rewards/view/rewards-view";
import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/lib/get-api-url";

export type Rewards = {
  id: string;
  title: string;
  coupon_code: string;
  discount: string;
  discription: string;
  validFrom: Date; // ISO Date
  validTo: Date;
  metallic?: string; // ISO Date
  status: "active" | "upcoming" | "expired";
  gradient?: string;
};

const page = async () => {
  const cookie = await cookies();
  let allRewards: Rewards[] = [];

  try {
    const baseUrl = await getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/rewards`, {
      cache: "no-store",
      headers: {
        Cookie: cookie.toString(),
      },
    });

    if (response.ok) {
      const result = await response.json();
      allRewards = result?.rewards || [];
    }
  } catch (error) {
    console.warn("Rewards page fetch fallback:", (error as Error).message);
  }

  return (
    <div className="px-8 ">
      <RewardsView allRewards={allRewards} />
    </div>
  );
};

export default page;

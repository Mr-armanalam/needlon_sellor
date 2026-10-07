import RewardsView from "@/modules/rewards/view/rewards-view";
import { cookies } from "next/headers";

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
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/rewards`, {
    cache: "no-store",
    headers: {
      Cookie: cookie.toString(),
    },
  });

  if (!response.ok) {
    return (
      <div className="px-8 py-4 text-red-500">
        Something went wrong!
      </div>
    );
  }

  const result = await response.json();
  const allRewards: Rewards[] = response.status !== 200 ? [] : result?.rewards;

  return (
    <div className="px-8 ">
      <RewardsView allRewards={allRewards} />
    </div>
  );
};

export default page;

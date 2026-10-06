"use client";

import { ArrowUpRight, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface BalanceMetaDetailsProps {
  balance?: string;
  growthText?: string;
  isPositiveGrowth?: boolean;
}

const BalanceMetaDetails = ({
  balance = "₹12,450",
  growthText = "+18.4% growth this week",
  isPositiveGrowth = true,
}: BalanceMetaDetailsProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-between gap-6 min-w-50">
      <div className="flex flex-col gap-1">
        <span className="text-[13px] font-medium text-neutral-400 tracking-tight">
          Available Balance
        </span>
        <span className="text-[32px] font-bold text-neutral-900 tracking-tight">
          {balance}
        </span>
        <div className={`flex items-center gap-1 text-[12px] font-semibold mt-1 ${isPositiveGrowth ? "text-emerald-600" : "text-amber-600"}`}>
          <TrendingUp size={14} />
          <span>{growthText}</span>
        </div>
      </div>

      {/* Primary Action Callout */}
      <button
        onClick={() => router.push("/earnings")}
        className="w-full py-3 px-4 bg-neutral-900 text-white hover:bg-neutral-800 text-[13px] font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group shadow-sm outline-none cursor-pointer"
      >
        <span>Withdraw funds</span>
        <ArrowUpRight
          size={14}
          strokeWidth={2.5}
          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </button>
    </div>
  );
};

export default BalanceMetaDetails;


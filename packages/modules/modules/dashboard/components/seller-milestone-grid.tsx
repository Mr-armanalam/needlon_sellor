"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { milestonesType } from "../view/gamified-card";
import { MilestoneItemDto } from "../dto/dashboard.dto";

const SellerMileStoneGrid = ({
  milestones,
}: {
  milestones: (MilestoneItemDto | milestonesType)[];
}) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-1">
      {milestones.map((item) => (
        <div
          key={item.id}
          onClick={() => {
            if (!item.completed && (item as any).actionUrl) {
              router.push((item as any).actionUrl);
            }
          }}
          className={`
                p-3.5 rounded-xl border flex flex-col gap-3 items-start transition-all duration-200 select-none
                ${
                  item.completed
                    ? "bg-neutral-50/50 border-neutral-100/80 text-neutral-500"
                    : "bg-white border-neutral-200/60 text-neutral-800 hover:border-neutral-900 cursor-pointer"
                }
              `}
        >
          {/* Checkbox Icon Indicator */}
          {item.completed ? (
            <CheckCircle2
              size={16}
              className="text-neutral-900"
              strokeWidth={2.5}
            />
          ) : (
            <Circle
              size={16}
              className="text-neutral-300 group-hover:text-neutral-400"
              strokeWidth={2.5}
            />
          )}

          <span className="text-[13px] font-semibold tracking-tight line-clamp-1">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SellerMileStoneGrid;


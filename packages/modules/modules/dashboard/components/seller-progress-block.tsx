import { Trophy } from "lucide-react";
import React from "react";

const SellerProgressBlock = ({percentage}:{percentage:number}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-neutral-900 text-white shadow-sm">
          <Trophy size={18} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col gap-0.5">
          <h4 className="text-[15px] font-semibold text-neutral-900 tracking-tight">
            Complete your Setup
          </h4>
          <p className="text-[12px] text-neutral-400 font-normal">
            Finish these steps to unlock higher store visibility.
          </p>
        </div>
      </div>

      {/* Progress Circular/Text Display */}
      <div className="flex flex-col items-end shrink-0">
        <span className="text-[20px] font-bold text-neutral-900 tracking-tight">
          {percentage}%
        </span>
        <span className="text-[11px] font-bold text-emerald-600 tracking-tight uppercase">
          Progress
        </span>
      </div>
    </div>
  );
};

export default SellerProgressBlock;

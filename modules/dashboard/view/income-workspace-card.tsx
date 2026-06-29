import { weeklyData } from "../data/earningsData";
import BalanceMetaDetails from "../components/balance-meta-details";
import ChartColumnTrack from "../components/chart-column-track";

const IncomeWorkspaceCard = () => {
  return (
    <div className="bg-white border border-neutral-100/80 rounded-2xl p-6 flex flex-col md:flex-row gap-8 items-stretch justify-between shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
      <BalanceMetaDetails />

      {/* Micro Bar Chart Layout */}
      <div className="flex-1 flex flex-col justify-end gap-4 min-h-40">
        <ChartColumnTrack />

        {/* Horizontal X-Axis Text Identifiers */}
        <div className="flex justify-between px-2 text-[11px] font-semibold text-neutral-400">
          {weeklyData.map((data, idx) => (
            <span
              key={idx}
              className="flex-1 text-center group-hover:text-neutral-900 transition-colors duration-200"
            >
              {data.day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncomeWorkspaceCard;

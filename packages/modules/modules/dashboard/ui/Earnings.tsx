import IncomeWorkspaceCard from "../view/income-workspace-card";

export default function Earnings() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-neutral-400 tracking-tight uppercase">
          Earnings Summary
        </h3>
      </div>

      <IncomeWorkspaceCard />
    </div>
  );
}

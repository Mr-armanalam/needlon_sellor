import { actions } from "../data/quickActionData";
import ActionGridComp from "../components/action-grid-component";

export default function QuickActions() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Label Section */}
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-neutral-400 tracking-tight uppercase">
          Quick Actions
        </h3>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          return <ActionGridComp key={index} action={action} />;
        })}
      </div>
    </div>
  );
}

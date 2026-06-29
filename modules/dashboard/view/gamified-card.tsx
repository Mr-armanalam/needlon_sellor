import SellerProgressBlock from "../components/seller-progress-block";
import SellerMileStoneGrid from "../components/seller-milestone-grid";

const milestones = [
  { id: 1, label: "Shop Profile", completed: true },
  { id: 2, label: "Verified Phone", completed: true },
  { id: 3, label: "Verified Shop", completed: true },
  { id: 4, label: "Add Logo", completed: false },
  { id: 5, label: "Add Cover Photo", completed: false },
];

export type milestonesType = (typeof milestones)[number];

const GamifiedCard = () => {

  //  percentage dynamically
  const completedCount = milestones.filter((m) => m.completed).length;
  const percentage = Math.round((completedCount / milestones.length) * 100);

  return (
    <div className="bg-white border border-neutral-100/80 rounded-2xl p-6 flex flex-col gap-6 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
      <SellerProgressBlock percentage={percentage} />

      {/* Smooth Micro-Progress Bar */}
      <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-neutral-900 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <SellerMileStoneGrid milestones={milestones} />
    </div>
  );
};

export default GamifiedCard;

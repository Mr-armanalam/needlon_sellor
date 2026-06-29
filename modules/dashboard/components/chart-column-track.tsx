import { weeklyData } from "../data/earningsData";

const ChartColumnTrack = () => {
  return (
    <div className="flex items-end justify-between h-32 gap-3 px-2 border-b border-neutral-100/70 pb-1">
      {weeklyData.map((data, index) => (
        <div
          key={index}
          className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative"
        >
          {/* Popover Hover Figure */}
          <div className="absolute -top-7 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 bg-neutral-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm pointer-events-none z-20 whitespace-nowrap">
            {data.amount}
          </div>

          {/* Vector Bar Column */}
          <div
            className={`w-full ${data.height} bg-neutral-100 group-hover:bg-neutral-900 rounded-t-md transition-all duration-300 ease-out`}
          />

          {/* Floating Shadow Anchor Effect */}
          <div className="w-full h-1 bg-transparent group-hover:bg-neutral-900/5 blur-[2px] transition-all duration-300" />
        </div>
      ))}
    </div>
  );
};

export default ChartColumnTrack;

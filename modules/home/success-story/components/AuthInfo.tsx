import { testMonialDataType } from "../../data/testimonialData";

const AuthInfo = ({ item }: { item: testMonialDataType }) => {
  return (
    <div className="mt-8 pt-6 border-t flex items-center gap-4 border-slate-100/60">

      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0
        ${item.isFeatured ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"}`}
      >
        {item.name.charAt(0)}
      </div>

      <div>
        <h4
          className={`text-sm font-bold tracking-tight
          ${item.isFeatured ? "text-white" : "text-slate-900"}`}
        >
          {item.name}
        </h4>
        <p
          className={`text-xs mt-0.5 font-medium
          ${item.isFeatured ? "text-indigo-300" : "text-slate-400"}`}
        >
          {item.role} • <span className="opacity-90">{item.location}</span>
        </p>
      </div>
    </div>
  );
};

export default AuthInfo;

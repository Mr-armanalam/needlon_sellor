import { trustItems } from "../../data/trustItemData";

const TrustItemCard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {trustItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col items-center text-center group hover:border-emerald-200 transition-all duration-200"
          >
            {/* Unified 'Verified Green' Icon Container */}
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-200">
              <Icon size={26} strokeWidth={1.75} />
            </div>

            <h4 className="font-bold text-slate-900 text-sm md:text-base">
              {item.title}
            </h4>

            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {item.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TrustItemCard;

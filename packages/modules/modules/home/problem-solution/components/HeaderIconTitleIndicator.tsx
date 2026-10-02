import { LucideProps } from "lucide-react";

const HeaderIconTitleIndicator = ({
  Icon,
}: {
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}) => {
  return (
    <div className="flex items-center gap-3.5 mb-6">
      <div className="p-2.5 bg-slate-50 rounded-xl text-slate-700 border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors duration-300">
        <Icon size={22} />
      </div>
      <div className="h-px flex-1 bg-linear-to-r Jacks from-slate-200 to-transparent"></div>
    </div>
  );
};

export default HeaderIconTitleIndicator;

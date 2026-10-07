import { IconType } from "react-icons/lib";

const ReachOut = ({
  icon,
  title,
  type,
}: {
  icon: IconType;
  title: string;
  type: string;
}) => {
  const Icon = icon;

  return (
    <div className="flex gap-3 items-center">
      <div className="bg-stone-900/30 dark:bg-white/5 dark:text-white p-3 rounded-xs text-stone-900">
        <Icon size={18} />
      </div>
      <div>
        <h3 className="mb-1.5 font-Playfair">{title}</h3>
        <p className="text-stone-950/60">{type}</p>
      </div>
    </div>
  );
};

export default ReachOut;

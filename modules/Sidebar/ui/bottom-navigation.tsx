import { footerNavItems } from "../data/bottom-navigationData";

const BottomNavigation = () => {
  return (
    <nav className="flex flex-col gap-1.5">
      {footerNavItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.name}
            className={`
                  group flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[14px] font-medium
                  transition-all duration-200 ease-out
                  ${
                    item.isDanger
                      ? "text-red-500 hover:bg-red-50/50 hover:text-red-600"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/60"
                  }
                `}
          >
            <Icon
              size={18}
              className={
                item.isDanger
                  ? "text-red-400 group-hover:text-red-500"
                  : "text-neutral-400 group-hover:text-neutral-600"
              }
            />
            <span>{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;

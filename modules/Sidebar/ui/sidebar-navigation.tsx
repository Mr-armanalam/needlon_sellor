"use client";
import { mainNavItems } from "../data/navigationData";
import { usePathname, useRouter } from "next/navigation";

const SideBarNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1.5">
      {mainNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.navigateTo.match(pathname);

        return (
          <button
            key={item.name}
            onClick={() => {
              router.push(item.navigateTo);
            }}
            className={`
                  group relative flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-[14px] font-medium
                  transition-all duration-200 ease-out outline-none
                  ${
                    isActive
                      ? "bg-white text-neutral-900 shadow-[0_4px_12px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)]"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/60"
                  }
                `}
          >
            {/* Active Indicator Bar */}
            {isActive && (
              <div className="absolute left-0 w-1 h-5 bg-neutral-900 rounded-r-full layout-transition" />
            )}

            <div className="flex items-center gap-3">
              <Icon
                size={18}
                className={`transition-transform duration-200 group-hover:scale-105 ${isActive ? "text-neutral-900" : "text-neutral-400 group-hover:text-neutral-600"}`}
              />
              <span>{item.name}</span>
            </div>

            {/* Badge Count */}
            {item.badge && (
              <span
                className={`
                    text-[11px] px-2 py-0.5 rounded-full font-bold transition-all duration-200
                    ${
                      isActive
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-200/60 text-neutral-600 group-hover:bg-neutral-200"
                    }
                  `}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default SideBarNavigation;
